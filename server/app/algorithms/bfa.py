import math
import numpy as np


def bellman_ford(graph, start=0):
    num_vertices = graph.order
    edge_to = np.zeros(num_vertices, dtype=int)
    dist_to = np.full(num_vertices, math.inf)
    dist_to[0] = 0
    print(dist_to)
    for i in range(num_vertices - 1):
        for v in range(num_vertices):
            print('v', v)
            adjacency_deque = graph.get_adjacent_edges(v)
            for edge in adjacency_deque:
                print('edge', edge)
                dist_to, edge_to = relax(edge, dist_to, edge_to)
                print('dist_to', dist_to)
                print('edge_to', edge_to)
        print(f'round {i} edge_to {edge_to}')
    return dist_to

def relax(edge, dist_to, edge_to):
    v = edge.start
    w = edge.end
    weight = edge.weight
    if dist_to[w] > dist_to[v] + weight:
        edge_to[w] = v
        dist_to[w] = dist_to[v] + weight
    return dist_to, edge_to
