
class Node:
    def __init__(self, vertex_id):
        self.vertex_id = vertex_id
        self.adjacency_dict = dict()

    def add_edge(self, vertex, weight=1):
        if self.vertex_id == vertex:
            return

        self.adjacency_dict[vertex] = weight

    def get_adjacent_vertices(self):
        return self.adjacency_dict

    def get_edge_weight(self, vertex):
        return self.adjacency_dict[vertex]
