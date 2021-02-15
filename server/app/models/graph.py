from odmantic import EmbeddedModel, Model, Field
from typing import (
    Dict, FrozenSet, List, Optional
)
from datetime import datetime


class Edge(EmbeddedModel):
    source: str
    target: str
    quote: float


def default_ts() -> float:
    return datetime.now().timestamp()


class Graph(Model):
    # open issue on odmantic repo for sets
    # https://github.com/art049/odmantic/issues/11
    # TODO: change when resolved
    nodes: List[str]  # FrozenSet[str] = frozenset()
    edges: List[Edge]
    profit: Optional[float]
    exchange: Optional[str]
    currency: Optional[str]
    # data: dict
    cycle: Optional[dict]
    timestamp: int = Field(default_factory=default_ts)
