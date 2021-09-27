
export const truncate = (string = '', length) => {
  return string.length > length ? string.substr(0, length).trim() + '...' : string
}

export const roundNumber = (num, dec) => {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

const isEdgeInCycle = (edge, cycle) => {
  if (!cycle) {
    return false
  }
  return !!cycle.edges.find(next => next.source === edge.source && next.target === edge.target)
}

export const createElements = (item, currencies, isCycle) => {
  const {nodes: prevNodes = [], edges: prevEdges = []} = item
  const nodes = prevNodes.map(next => ({
    data: {id: next, svg: currencies[next].svg.color}
  }))
  const edges = prevEdges.map(edge => {
    const inCycle = isCycle || isEdgeInCycle(edge, item.cycle)
    return {
      data: {
        ...edge,
        quote: roundNumber(edge.quote, 8),
        ...inCycle && {inCycle}
      }
    }})
  return {
    nodes,
    edges
  }
}
