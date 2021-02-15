from app.graphs.graph import Graph
import numpy as np


class AdjacencyMatrixGraph(Graph):

    def __init__(self, num_vertices, directed=False):
        super(AdjacencyMatrixGraph, self).__init__(num_vertices, directed)

        self.matrix = np.zeros((num_vertices, num_vertices))

    def add_edge(self, edge):
        v1 = edge.start
        v2 = edge.end
        weight = edge.weight
        if v1 >= self.num_vertices or v2 >= self.num_vertices or v1 < 0 or v2 < 0:
            raise ValueError('Vertices %d and %d are out of bounds' % (v1, v2))

        self.matrix[v1, v2] = weight

        if not self.directed:
            self.matrix[v2, v1] = weight

    def get_adjacent_vertices(self, v):
        if v >= self.num_vertices or v < 0:
            raise ValueError('Vertex %d out of bound' % v)

        adjacent_vertices = []

        for i in range(self.num_vertices):
            if self.matrix[v][i] != 0:
                adjacent_vertices.append(i)

        return adjacent_vertices

    def get_in_degree(self, v):
        if v >= self.num_vertices or v < 0:
            raise ValueError('Vertex %d out of bound' % v)

        in_degree = 0

        for i in range(self.num_vertices):
            in_degree += self.matrix[i][v]

        return in_degree

    def get_edge_weight(self, v1, v2):
        return self.matrix[v1][v2]

    def display(self):
        for i in range(self.num_vertices):
            for v in self.get_adjacent_vertices(i):
                print(i, '-->', v)
