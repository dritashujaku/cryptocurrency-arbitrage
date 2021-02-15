from queue import Queue


def breadth_first(graph, start=0):
    queue = Queue()
    queue.put(start)

    visited = set()  # numpy.zeros(num_vertices)

    while not queue.empty():
        vertex = queue.get()

        if vertex in visited:  # visited[vertex] == 1
            continue

        visited.add(vertex)

        for v in graph.get_adjacent_vertices(vertex):
            if v not in visited:  # visited[v] != 1
                queue.put(v)


def depth_first(graph, visited, current=0):
    if visited[current] == 1:
        return

    visited[current] = 1

    for vertex in graph.get_adjacent_vertices(current):
        depth_first(graph, visited, vertex)
