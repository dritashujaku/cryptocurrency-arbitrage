from collections import deque

import numpy as np

from app.graphs.edge import Edge


class CycleFinder:

    def __init__(self, graph):
        self.edge_to = np.full(graph.order, None, dtype=Edge)  # np.array(graphs.order)
        self.marked = np.full(graph.order, False)
        self.onStack = np.full(graph.order, False)
        self.cycle = None

        for v in range(graph.order):
            if not self.marked[v]:
                self.dfs(graph, v)

    def dfs(self, graph, v):
        self.marked[v] = True
        self.onStack[v] = True
        # print(f'adjacent edges from {v} {graphs.get_adjacent_edges(v)}')
        for e in graph.get_adjacent_edges(v):
            # print(f'edge from {v} {e}')
            w = e.end
            if self.has_cycle:
                return
            elif not self.marked[w]:
                self.edge_to[w] = e
                # print(f'edge_to {self.edge_to}')
                self.dfs(graph, w)
            elif self.onStack[w]:
                self.cycle = deque()
                temp_e = e
                while temp_e.start is not w:
                    self.cycle.appendleft(temp_e)
                    # print(f'current {temp_e}')
                    temp_e = self.edge_to[temp_e.start]
                    # print(f'next {temp_e}')
                self.cycle.appendleft(temp_e)
                return
        self.onStack[v] = False

    @property
    def cycle(self):
        return self._cycle

    @property
    def has_cycle(self):
        return self._cycle is not None

    @cycle.setter
    def cycle(self, value):
        self._cycle = value
