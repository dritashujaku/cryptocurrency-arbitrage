import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import cytoscape from 'cytoscape'

const useStyles = makeStyles(({spacing}) => ({
  root: {
    display: 'flex',
    flex: 1,
    height: `calc(100vh - ${spacing(4)}px)`,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
  }
}), {name: 'GraphContainer'})


const getNodeStyle = node => ({
  selector: `#${node.data.id}`,  // 'node',
  style: {
    width: 40,
    height: 40,
    'border-color': '#000',
    'border-width': 2,
    'border-opacity': 0.5,
    'background-image': 'data:image/svg+xml;utf8,' + encodeURIComponent(node.data.svg),
    'background-opacity': 0,
    'background-fit': 'cover'
  }
})

const edgesStyle = {
  selector: 'edge',
  style: {
    label: 'data(quote)',
    width: 5,
    'curve-style': 'bezier',
    'target-arrow-shape': 'triangle',
    'line-fill': 'linear-gradient',
    'line-opacity': 0.5,
    'line-color': '#36b08a',
    'target-arrow-color': '#8270bf',
    'line-gradient-stop-colors': '#36b08a #8270bf',
    // "arrow-scale": 20
  }
}

const violet = '#C5B0B8'

const edgeColor = '#5AC79D'
// green '#A7C987'
// blue '#4EB0BA'

const cycleEdgeStyle = {
  selector: 'edge[?inCycle]',
  style: {
    // 'line-color': '#d76a26',
    // 'target-arrow-color': '#ffc967',
    // 'line-gradient-stop-colors': '#d76a26 #ffc967',
    'line-color': '#5AC79D', // '#4DC59D',
    'target-arrow-color': edgeColor,
    'line-gradient-stop-colors': edgeColor,
    'line-opacity': 0.8
  }
}

const edgeLabelStyle = {
  selector: 'edge[quote]',
  css: {
    // 'label': 'data(quote)',
    'text-rotation': 'autorotate',
    'text-margin-x': '0px',
    'text-margin-y': '0px',
    'text-valign': 'center',
    'text-halign': 'center',
    'color': '#94a6b8',
    'font-size': 10,
    // 'text-background-opacity': 0.4,
    // 'text-background-color': '#202121'
  }
}

const cycleEdgeLabelStyle = {
  selector: 'edge[quote][?inCycle]',
  css: {
    'color': '#d2d2e5',
    'font-size': 15,
    'z-index': 101,
    'z-index-compare': 'manual',
    'z-compound-depth': 'top',
    'text-background-opacity': 0.4,
    'text-background-color': '#202121'
  }
}

const GraphContainer = props => {

  const {elements} = props

  const classes = useStyles()

  const container = useRef(null)
  const graph = useRef(null)

  const buildGraph = () => {
    graph.current = cytoscape({
      container: container.current,
      elements,
      layout: {
        name: 'circle',
        fit: true,
        directed: true,
        center: true
        // padding: 10
      },
      style: [
        ...elements.nodes.map(getNodeStyle),
        edgesStyle,
        edgeLabelStyle,
        cycleEdgeStyle,
        cycleEdgeLabelStyle
      ]
    })
  }


  useEffect(() => {
    if (!container.current) {
      return
    }
    buildGraph()

    return () => {
      graph.current && graph.current.destroy()
    }
  }, [elements])

  console.log('elements', elements)

  return (
    <div className={classes.root}>
      <div className={classes.container} ref={container}/>
    </div>
  )
}

export default GraphContainer