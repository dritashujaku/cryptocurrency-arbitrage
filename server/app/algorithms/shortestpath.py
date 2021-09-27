import math
from collections import deque

import numpy as np

from app.graphs.adjacencylist import AdjacencyListGraph
from app.algorithms.cyclefinder import CycleFinder
from app.graphs.edge import Edge


class ShortestPath:

    def __init__(self, graph, start=0):
        self.num_vertices = graph.order
        self.edge_to = np.full(self.num_vertices, None, dtype=Edge)
        self.dist_to = np.full(self.num_vertices, math.inf)
        self.dist_to[0] = 0
        self.num_calls = 0
        self.cycle = None
        self.queue = deque()
        self.bellmanford(graph, start)

    def bellmanford(self, graph: AdjacencyListGraph, source: int):
        self.queue.append(source)
        while len(self.queue) and self.cycle is None:
            v = self.queue.popleft()
            self.relax(graph, v)

    def relax(self, graph: AdjacencyListGraph, v: int):
        for edge in graph.get_adjacent_edges(v):
            w = edge.end
            weight = edge.weight

            if self.dist_to[w] > self.dist_to[v] + weight:
                self.edge_to[w] = edge
                self.dist_to[w] = self.dist_to[v] + weight
                if w not in self.queue:
                    self.queue.append(w)
            self.num_calls += 1
            if self.num_calls % graph.order == 0:
                self.find_cycle()
                if self.has_negative_cycle():
                    return

    def find_cycle(self):
        v = len(self.edge_to)
        g = AdjacencyListGraph(v)
        for i in range(v):
            current = self.edge_to[i]
            # print(f'current edge_to[{i}] = {current}')
            if current is not None:
                g.add_edge(current)
        finder = CycleFinder(g)
        self.cycle = finder.cycle

    def has_negative_cycle(self):
        return self.cycle is not None
