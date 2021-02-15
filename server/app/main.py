from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.mongo import engine
from app.service.arbitrage import find
from app.models.graph import Graph

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


@app.post('/arbitrage', response_model=Graph)
async def findarbitrage(graph: Graph):
    arbitrage = find(graph)  # build_graph
    print('arbitrage', arbitrage)
    if arbitrage:
        return await engine.save(arbitrage)
    return graph
    # return JSONResponse(status_code=status.HTTP_201_CREATED, content=dict)


@app.get('/arbitrages', response_model=List[Graph])
async def get_all(skip: int = 0, limit: Optional[int] = None):
    result = await engine.find(Graph, skip=skip, limit=limit)
    print(result)
    return result
