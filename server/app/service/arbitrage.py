import math
from functools import reduce
from math import log

from app.graphs.adjacencylist import AdjacencyListGraph
from app.graphs.edge import Edge
from app.models.graph import Graph, Edge as EdgeModel
from app.algorithms.shortestpath import ShortestPath


def find(graph, start):
    rates_graph = AdjacencyListGraph(len(graph.nodes))
    for item in graph.edges:
        edge = Edge(
            graph.nodes.index(item.source),
            graph.nodes.index(item.target),
            -log(item.quote)  # -log(item.quote, 2)
        )
        rates_graph.add_edge(edge)
    shortest_path = ShortestPath(rates_graph, start)
    if not shortest_path.has_negative_cycle():
        return None
    nodes = []  # set()
    edges = []
    starting_unit = 1
    ending_unit = starting_unit
    for edge in shortest_path.cycle:
        source = graph.nodes[edge.start]
        target = graph.nodes[edge.end]
        quote = pow(math.e, -edge.weight)
        print(f'{ending_unit} {source} = {ending_unit*quote} {target}')
        ending_unit *= quote
        nodes.append(source)
        edges.append(EdgeModel(source=source, target=target, quote=quote))
    # ending_unit = reduce(lambda x, y: x * y.quote, edges, starting_unit)
    profit = ending_unit - starting_unit
    currency = edges[-1].target
    result = {
        **graph.dict(),
        'cycle': {'nodes': nodes, 'edges': edges},
        'profit': profit,
        'currency': currency
    }
    return Graph(**result)
