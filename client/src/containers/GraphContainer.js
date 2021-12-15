import React, { useEffect, useRef } from 'react'
import {makeStyles, useTheme} from '@material-ui/core'
import cytoscape from 'cytoscape'
import classNames from 'classnames'
import useWindowSize from 'utils/useWindowSize'

const useStyles = makeStyles(({spacing}) => ({
  root: {
    // display: 'flex',
    // justifyContent: 'center',
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

const edgesStyle = palette => ({
  selector: 'edge',
  style: {
    label: 'data(quote)',
    width: 5,
    'curve-style': 'bezier',
    'target-arrow-shape': 'triangle',
    'line-fill': 'linear-gradient',
    'line-opacity': 0.35,
    // 'line-color': palette.graph[5],
    'target-arrow-color': palette.graph[4],
    'line-gradient-stop-colors': `${palette.graph[0]} ${palette.graph[4]}`
  }
})


const cycleEdgeStyle = palette => {
  const edgeColor = palette.highlight.tertiary
  return {
    selector: 'edge[?inCycle]',
    style: {
      'line-color': edgeColor,
      'target-arrow-color': edgeColor,
      'line-gradient-stop-colors': edgeColor,
      'line-opacity': 0.8
    }
  }
}

const edgeLabelStyle = palette => ({
  selector: 'edge[quote]',
  css: {
    // 'label': 'data(quote)',
    'text-rotation': 'autorotate',
    'text-margin-x': '0px',
    'text-margin-y': '0px',
    'text-valign': 'center',
    'text-halign': 'center',
    'color': palette.text.secondary, // '#94a6b8',
    'font-size': 10,
    // 'text-background-opacity': 0.4,
    // 'text-background-color': '#202121'
  }
})

const cycleEdgeLabelStyle = palette => ({
  selector: 'edge[quote][?inCycle]',
  css: {
    'color': palette.text.default,
    'font-size': 15,
    'z-index': 101,
    'z-index-compare': 'manual',
    'z-compound-depth': 'top',
    'text-background-opacity': 0.4,
    'text-background-color': palette.background.main
  }
})

const GraphContainer = props => {

  const {className, elements} = props

  const classes = useStyles()
  const {palette} = useTheme()

  const container = useRef(null)
  const graph = useRef(null)

  const [width] = useWindowSize()

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
        edgesStyle(palette),
        edgeLabelStyle(palette),
        cycleEdgeStyle(palette),
        cycleEdgeLabelStyle(palette)
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
  }, [elements, width])


  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.container} ref={container}/>
    </div>
  )
}

export default GraphContainer