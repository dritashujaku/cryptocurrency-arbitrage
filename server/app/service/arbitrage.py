import math
from math import log

from app.graphs.adjacencylist import AdjacencyListGraph
from app.graphs.edge import Edge
from app.models.graph import Graph, Edge as EdgeModel
from app.algorithms.shortestpath import ShortestPath


def find(graph):
    rates_graph = AdjacencyListGraph(len(graph.nodes))
    for item in graph.edges:
        edge = Edge(
            graph.nodes.index(item.source),
            graph.nodes.index(item.target),
            -log(item.quote)  # -log(item.quote, 2)
        )
        rates_graph.add_edge(edge)
    shortest_path = ShortestPath(rates_graph)
    nodes = []  # set()
    edges = []
    if shortest_path.has_negative_cycle():
        starting_unit = 1
        ending_unit = starting_unit
        for edge in shortest_path.cycle:
            quote = pow(math.e, -edge.weight)
            ending_unit *= quote
            print(f'1 {graph.nodes[edge.start]} = {pow(math.e, -edge.weight)} {graph.nodes[edge.end]}')
            nodes.append(graph.nodes[edge.start])
            edges.append(EdgeModel(source=graph.nodes[edge.start], target=graph.nodes[edge.end], quote=quote))
        profit = ending_unit - starting_unit
        currency = edges[-1].target
        cycle = {'nodes': nodes, 'edges': edges}
        result = {
            **graph.dict(),
            'cycle': cycle,
            'profit': profit,
            'currency': currency
        }
        return Graph(**result)
    return None
