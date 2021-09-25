import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import cytoscape from 'cytoscape'

const useStyles = makeStyles(({}) => ({
  root: {
    display: 'flex',
    flex: 1,
    width: '98vw',
    height: '90vh',
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
    'border-color': '#000',
    'border-width': 2,
    'border-opacity': 0.5,
    // 'background-width': '100%',
    // 'background-height': '100%',
    width: 40,
    height: 40,
    'background-image': 'data:image/svg+xml;utf8,' + encodeURIComponent(node.data.svg),
    'background-opacity': 0,
    // 'background-clip': 'none',
    'background-fit': 'cover',
    // 'background-position-x' : 0,
    // 'background-position-y' : 0
  }
})

const edgesStyle = {
  selector: 'edge',
  style: {
    label: 'data(quote)',
    width: 5,
    // 'line-color': '#8b8b91',
    'line-color': '#36b08a',
    'target-arrow-color': '#8270bf',
    'curve-style': 'bezier',
    'target-arrow-shape': 'triangle',
    'line-opacity': 0.5,
    'line-fill': 'linear-gradient',
    'line-gradient-stop-colors': '#36b08a #8270bf'
    // "arrow-scale": 20
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
    'color': '#94A6B8',
    'font-size': 10,
    // "text-background-opacity": 0.7,
    // "text-background-color": "#000",
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
        edgeLabelStyle
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


  return (
    <div className={classes.root}>
      <div className={classes.container} ref={container}/>
    </div>

  )
}

export default GraphContainer