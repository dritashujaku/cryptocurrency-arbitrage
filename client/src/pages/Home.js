/**
 * Created by Drita Shujaku on 15/07/2020
 */

import React, {useEffect, useState} from 'react'
import {makeStyles, Switch} from '@material-ui/core'
import Page from 'pages/Page'
import {useDispatch, useSelector} from 'react-redux'
import GraphContainer from 'containers/GraphContainer'
import {loadArbitrages, update} from 'reducers/ArbitragesActions'
import {selectLastArbitrage, selectSortedArbitrages} from 'reducers/Arbitrages'
import {getCurrencies, pairSymbols} from 'utils/currencies'
import {createElements} from 'utils/helper-functions'
import useWebSocket from 'utils/useWebSocket'
import HistoryTable from 'containers/HistoryTable'


const useStyles = makeStyles(({palette, spacing}) => ({
	container: {
		width: '100%',
		height: '100%',
		paddingRight: spacing()
	},
	information: {
		display: 'flex',
		flexFlow: 'column',
		minWidth: '40%',
		height: '100%',
		justifyContent: 'center',
		marginLeft: spacing(2),
		'& > *:not(:last-child)': {
			marginBottom: spacing(2)
		}
	},
	table: {},
	switch: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		'& > *:not(:last-child)': {
			marginRight: spacing()
		}
	}
}))

const defaultGraph = {nodes: [], edges: [], cycle: {}}

const Home = props => {

	const {} = props

	const classes = useStyles()

	const dispatch = useDispatch()
	const arbitrages = useSelector(selectSortedArbitrages)
	const last = useSelector(selectLastArbitrage)
	console.log('arbitrages', arbitrages)

	const [graph, setGraph] = useState(last || defaultGraph)
	const [cycleToggle, setCycleToggle] = useState(false)
	const [request, setRequest] = useState(0)

	const message = {
		exchange: 'binance',
		pairs: pairSymbols
	}

	const onMessage = data => {
		dispatch(update(data))
	}

	const sendMessage = (ws) => {
		ws.send(JSON.stringify(message))
	}

	const onOpen = ws => {
		sendMessage(ws)
	}

	const {webSocket} = useWebSocket('ws', onOpen, onMessage)

	useEffect(() => {
		dispatch(loadArbitrages())
	}, [])

	useEffect(() => {
		if (!last) {
			return
		}
		setGraph(last)
	}, [last])

	useEffect(() => {
		if (!request) {
			return
		}
		sendMessage(webSocket)
	}, [request])

	useEffect(() => {
		if (cycleToggle) {
			setGraph(graph.cycle)
		} else {
			if (last) {
				setGraph(last)
			}
		}
	}, [cycleToggle])

	useEffect(() => {
		if (graph.cycle && cycleToggle) {
			setCycleToggle(!cycleToggle)
		}
	}, [graph])


	// console.log('moment formatted', moment.utc(data.timestamp).local().format("D MMM YYYY HH:mm Z"))
	// console.log('moment formatted', moment.unix(data.timestamp).format("D MMM YYYY HH:mm:ss Z"))


	return (
		<Page>
			<GraphContainer elements={createElements(graph, getCurrencies(graph.nodes))}/>
			<div className={classes.information}>
				<span>Arbitrages found so far: {arbitrages.length}</span>
				<div>Request: {request}</div>
				<HistoryTable className={classes.table} items={arbitrages} selected={graph.id} onCellClick={graph => setGraph(graph)}/>
				<div className={classes.switch}>
					<Switch checked={cycleToggle} size={'small'} onClick={() => setCycleToggle(!cycleToggle)}/>
					<span>{cycleToggle ? 'Hide' : 'Show'} Cycle</span>
				</div>
			</div>
		</Page>
	)
}

export default Home