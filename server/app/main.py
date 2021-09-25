import asyncio
import math
from functools import reduce
from typing import List, Optional

from fastapi import FastAPI, WebSocket
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
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


@app.get('/')
async def root():
    return {'message': 'Welcome'}


# @app.post('/arbitrage', response_model=Graph)
async def findarbitrage(graph: Graph):
    arbitrage = find(graph)  # build_graph
    print('arbitrage', arbitrage)
    if arbitrage:
        return await engine.save(arbitrage)
    return None
    # return JSONResponse(status_code=status.HTTP_201_CREATED, content=dict)


@app.get('/arbitrages', response_model=List[Graph])
async def get_all(skip: int = 0, limit: Optional[int] = None):
    result = await engine.find(Graph, skip=skip, limit=limit)
    print(result)
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
    while True:
        try:
            yield await exchange.fetchBidsAsks(pairs)
            await exchange.close()
            await asyncio.sleep(exchange.rateLimit / 1000)
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
            break


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # while True:
        exchange_name = await websocket.receive_text()
        exchange_id = exchange_name.lower()
        exchange = await setup_exchange(exchange_id)
        # response = await exchange.fetchBidsAsks(pairSymbols)
        # await exchange.close()
        async for orderbook in poll(exchange, pairSymbols):
            print('order book', orderbook)
            print('response from exchange', orderbook)
            graph = build_graph(orderbook, 'binance')
            print('graph built', graph)
            data = await findarbitrage(Graph(**graph))
            if data is not None:
                print('data', data)
                await websocket.send_json(jsonable_encoder(data))
        await exchange.close()
    except WebSocketDisconnect:
        print('ex')
    await websocket.close()


pairSymbols = [
    'ADA/EUR',
    'ADA/ETH',
    'ADA/USD',
    'ADA/USDT',
    'ADA/BTC',
    'DAI/USDT',
    'DOT/ETH',
    'DOT/USDT',
    'DOT/EUR',
    'DOT/BTC',
    'ETH/USDT',
    'LINK/ETH',
    'LINK/EUR',
    'LINK/USDT',
    'LINK/BTC',
    'NANO/ETH',
    'NANO/BTC',
    'DOGE/USDT',
    'DOGE/EUR',
    'DOGE/BTC',
    'LTC/BTC',
    'LTC/USD',
    'LTC/USDT',
    'LTC/EUR',
    'XRP/ETH',
    'XRP/USD',
    'XRP/USDT',
    'XRP/BTC',
    'XRP/EUR',
    'BTC/EUR',
    'BTC/USD',
    'BTC/USDT',
    'BTC/DAI',
]


async def setup_exchange(exchange_id='binance'):
    loop = asyncio.get_event_loop()
    exchange = getattr(ccxt, exchange_id)({
        'asyncio_loop': loop,
        'enableRateLimit': True,  # as required by https://github.com/ccxt/ccxt/wiki/Manual#rate-limit
    })
    # response = await exchange.fetchBidsAsks(pairSymbols)
    # print('response', response)
    # await exchange.close()
    return exchange


def map_props(array, pair):
    print('pair', pair)
    source, target = pair['symbol'].split('/')
    bid_dict = {
        'source': source,
        'target': target,
        'quote': pair['bid']
    }
    ask_dict = {
        'source': target,
        'target': source,
        'quote': 1 / (pair['ask'] or math.inf)
    }
    return [*array, bid_dict, ask_dict]


def build_graph(obj, exchange):
    print('object values', obj.values())
    all_edges = reduce(map_props, obj.values(), [])
    edges = list(filter(
        lambda symbol: 'quote' in symbol
                       and (bool(symbol['quote']) or
                            (symbol['quote'] != math.inf and symbol['quote'] != 0)),
        all_edges
    ))
    currencies = reduce(lambda acc, edge: [*acc, edge['source'], edge['target']], edges, [])
    nodes = list(dict.fromkeys(currencies))
    return {'edges': edges, 'nodes': nodes, 'exchange': exchange}

# Run main coroutine
# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())
# loop.close()

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
