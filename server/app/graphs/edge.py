
class Edge(object):
    def __init__(self, v, w, weight: float = 1):
        self._start = v
        self._end = w
        self._weight = weight

    @property
    def start(self):
        return self._start

    @property
    def end(self):
        return self._end

    @property
    def weight(self):
        return self._weight

    def __str__(self):
        return f'{self.start} --> {self.end}: {self.weight}'
