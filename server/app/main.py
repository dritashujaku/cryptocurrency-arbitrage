import asyncio
import json
import math
from functools import reduce
from random import randint
from typing import List, Optional, Any

from fastapi import FastAPI, WebSocket
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from odmantic.query import desc
from starlette.websockets import WebSocketDisconnect

from app.mongo import engine
from app.service.arbitrage import find
from app.models.graph import Graph

import ccxt.async_support as ccxt

app = FastAPI()

origins = [
    '*',
    'http://localhost',
    'http://localhost:8080'
    'http://localhost:8083'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

@app.get('/')
async def root():
    return {'message': 'Welcome'}


async def findarbitrage(graph: Graph, start):
    print('random int start', start)
    arbitrage = find(graph, start)  # build_graph
    # print('arbitrage', arbitrage)
    if arbitrage:
        return await engine.save(arbitrage)
    return None
    # return JSONResponse(status_code=status.HTTP_201_CREATED, content=dict)


@app.get('/arbitrages', response_model=List[Graph])
async def get_all(skip: int = 0, limit: Optional[int] = None):
    result = await engine.find(Graph, sort=desc(Graph.timestamp), skip=skip, limit=limit)
    return result


@app.get('/top', response_model=List[Graph])
async def get_top(limit: int = 10):
    result = await engine.find(Graph, sort=desc(Graph.profit), limit=limit)
    return result


response = {
    'LTC/BTC': {
        'symbol': 'LTC/BTC',
        'timestamp': None,
        'datetime': None,
        'high': None,
        'low': None,
        'bid': 0.003641,
        'bidVolume': 78.33,
        'ask': 0.003642,
        'askVolume': 136.1,
        'vwap': None,
        'open': None,
        'close': None,
        'last': None,
        'previousClose': None,
        'change': None,
        'percentage': None,
        'average': None,
        'baseVolume': None,
        'quoteVolume': None,
        'info': {
            'symbol': 'LTCBTC',
            'bidPrice': '0.00364100',
            'bidQty': '78.33000000',
            'askPrice': '0.00364200',
            'askQty': '136.10000000'
        }
    }
}


async def poll(exchange, pairs):
    # while True:
    try:
        await asyncio.sleep(exchange.rateLimit / 1000 * 50)
        return await exchange.fetchBidsAsks(pairs)
        # await exchange.close()
    # except ccxt.RequestTimeout as e:
    #     print('[' + type(e).__name__ + ']')
    #     print(str(e)[0:200])
    # except ccxt.DDoSProtection as e:
    #     print('[' + type(e).__name__ + ']')
    #     print(str(e.args)[0:200])
    #     # retry in a min
    #     await asyncio.sleep(60 * 1000)
    # except ccxt.ExchangeNotAvailable as e:
    #     print('[' + type(e).__name__ + ']')
    #     print(str(e.args)[0:200])
    #     # retry in a min
    #     await asyncio.sleep(60 * 1000)
    except ccxt.NetworkError as e:
        print('[' + type(e).__name__ + ']')
        print(str(e.args)[0:200])
        # retry in a min
        await asyncio.sleep(60 * 1000)
    except ccxt.ExchangeError as e:
        print('[' + type(e).__name__ + ']')
        print(str(e)[0:200])
        # abort
        # break


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            request = await websocket.receive_json()
            # print('client request', request)
            exchange_name = request['exchange']
            pairs = request['pairs']
            exchange_id = exchange_name.lower()
            exchange = await setup_exchange(exchange_id)
            # message = asyncio.create_task(websocket.receive_json())
            data = None
            while data is None:
                orderbook = await poll(exchange, pairs)
                # print('order book', orderbook)
                graph = build_graph(orderbook, exchange_id, pairs)
                if len(graph):
                    data = await findarbitrage(Graph(**graph), randint(0, len(graph['nodes']) - 1))
            if data is not None:
                await websocket.send_json(jsonable_encoder(data))
    except WebSocketDisconnect as e:
        print('[' + type(e).__name__ + ']')
        print(str(e)[0:200])
    await websocket.close()


async def setup_exchange(exchange_id='binance'):
    loop = asyncio.get_running_loop()
    exchange = getattr(ccxt, exchange_id)({
        'asyncio_loop': loop,
        'enableRateLimit': True,  # as required by https://github.com/ccxt/ccxt/wiki/Manual#rate-limit
    })
    return exchange


def map_props(array, pair):
    # print('pair', pair)
    source, target = pair['symbol'].split('/')
    bid_dict = {
        'source': source,
        'target': target,
        'quote': pair['bid'],
        'volume': pair['bidVolume']
    }
    ask_dict = {
        'source': target,
        'target': source,
        'quote': 1 / (pair['ask'] or math.inf),
        'volume': pair['askVolume']
    }
    return [*array, bid_dict, ask_dict]


def order_pairs(array, market, obj):
    if market not in obj:
        return array
    return [*array, obj[market]]


def build_graph(obj, exchange, pairs):
    ordered_markets = reduce(lambda array, x: order_pairs(array, x, obj), pairs, [])
    print('ordered_markets', ordered_markets)
    all_edges = reduce(map_props, ordered_markets, [])
    edges = list(filter(
        lambda symbol: 'quote' in symbol and (bool(symbol['quote']) or
                                              (symbol['quote'] != math.inf and symbol['quote'] != 0)),
        all_edges
    ))
    currencies = reduce(lambda acc, edge: [*acc, edge['source'], edge['target']], edges, [])
    nodes = list(dict.fromkeys(currencies))
    return {'edges': edges, 'nodes': nodes, 'exchange': exchange}


# ------------------------------------------------------------------------------
#
# async def poll(tickers):
#     i = 0
#     kraken = ccxt.kraken()
#     while True:
#         symbol = tickers[i % len(tickers)]
#         yield (symbol, await kraken.fetch_ticker(symbol))
#         i += 1
#         await asyncio.sleep(kraken.rateLimit / 1000)
#
# #------------------------------------------------------------------------------
#
# async def main():
#     async for (symbol, ticker) in poll(['BTC/USD', 'ETH/BTC', 'BTC/EUR']):
#         print(symbol, ticker)
