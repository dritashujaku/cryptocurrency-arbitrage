from collections import deque
import numpy as np

from app.graphs.graph import Graph


class AdjacencyListGraph(Graph):

    def __init__(self, num_vertices, directed=True):
        super(AdjacencyListGraph, self).__init__(num_vertices, directed)

        self.vertex_list = [deque() for _ in range(num_vertices)]

        # for i in range(num_vertices):
        #     self.vertex_list.append(Node(i))

    @property
    def order(self):
        return len(self.vertex_list)

    # def get_vertex(self, index):
    #     return self.vertex_list[index]

    def add_edge(self, edge):
        v = edge.start
        w = edge.end
        self.vertex_list[v].appendleft(edge)

        if not self.directed:
            self.vertex_list[w].appendleft(edge)

    def get_adjacent_edges(self, v):
        return self.vertex_list[v]

    def get_adjacent_vertices(self, v):
        """get an array of numbers, which represent adjacent nodes to v"""
        adjacent_vertices = np.fromiter((edge.end for edge in self.get_adjacent_edges(v)), dtype=int)
        return adjacent_vertices

    def get_in_degree(self, v):
        """get the number of nodes that have an edge to v"""
        in_degree = 0
        for i in range(self.num_vertices):
            if v in self.get_adjacent_vertices(i):
                in_degree += 1
        return in_degree

    def get_edge_weight(self, v1, v2):
        """get the weight of the edge from v1 to v2"""
        adjacency_deque = self.vertex_list[v1]
        weight = 1
        for edge in adjacency_deque:
            if edge.end == v2:
                weight = edge.weight
        return weight

    def display(self):
        result = ''
        for i in range(self.num_vertices):
            # for v in self.get_adjacent_vertices(i):
            #     result += f'\n{i} --> {v}'
            result += f'{i}: '
            for edge in self.get_adjacent_edges(i):
                result += f'{edge} '
            result += '\n'
        return result
