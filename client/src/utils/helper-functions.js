
export const truncate = (string = '', length) => {
  return string.length > length ? string.substr(0, length).trim() + '...' : string
}

export const capitalize = text => {
  const [first, ...rest] = text
  return first.toUpperCase() + rest.join("")
}


export const createElements = (item, currencies) => {
  const nodes = item.nodes.map(next => ({
    data: {id: next, svg: currencies[next].svg.color}
  }))
  const edges = item.edges.map(data => ({
    data
  }))
  return {
    nodes,
    edges
  }
}

export const createGraph = (item, exchange) => {
  // if (!item) {
  //   return {
  //     nodes: [],
  //     edges: []
  //   }
  // }
  const edges = Object.entries(item).reduce((acc, [source, targets = {}]) => {
    const edgesFromSource = Object.entries(targets).map(([target, quote]) => ({
      source, target, quote
    }))
    return [...acc, ...edgesFromSource]
  }, [])

  const nodes = edges.reduce((acc, current) => {
    const edgeNodes = [current.source, current.target]
    return acc.concat(edgeNodes)
  }, []).filter((next, index, array) => array.indexOf(next) === index)

  const graph = {nodes, edges, exchange}

  console.log('graph from item', graph)
  return graph
}
export const createGraphFromTickers = (item, exchange) => {
  // if (!item) {
  //   return {
  //     nodes: [],
  //     edges: []
  //   }
  // }
  const edges = Object.values(item).map(ticker => {
    const [source, target] = ticker.symbol.split('/')
    return {
      source,
      target,
      quote: ticker.last
    }
  })

  const nodes = edges.reduce((acc, current) => {
    const edgeNodes = [current.source, current.target]
    return acc.concat(edgeNodes)
  }, []).filter((next, index, array) => array.indexOf(next) === index)

  const graph = {nodes, edges, exchange}

  console.log('graph from item', graph)
  return graph
}


export const createGraphFromOrders = (item = {}, exchange) => {
  // if (!item) {
  //   return {
  //     nodes: [],
  //     edges: []
  //   }
  // }
  const edges = Object.values(item).reduce((acc, next) => {
    const [source, target] = next.symbol.split('/')
    return acc.concat([{
      source,
      target,
      quote: next.bid
    }, {
      source: target,
      target: source,
      quote: 1 / next.ask
    }])
  }, []).filter(({quote}) => !!quote || quote !== Infinity)

  const nodes = edges.reduce((acc, current) => {
    const edgeNodes = [current.source, current.target]
    return acc.concat(edgeNodes)
  }, []).filter((next, index, array) => array.indexOf(next) === index)

  const graph = {nodes, edges, exchange}

  console.log('graph from item', graph)
  return graph
}
