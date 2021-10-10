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
import {selectView} from 'reducers/ArbitragesView'
import LoadingIndicator from 'utils/LoadingIndicator'


const useStyles = makeStyles(({palette, spacing}) => ({
	container: {
		width: '100%',
		height: '100%'
	},
	information: {
		display: 'flex',
		flexFlow: 'column',
		minWidth: '30%',
		height: '100%',
		justifyContent: 'center',
		padding: spacing(2),
		'& > *:not(:last-child)': {
			marginBottom: spacing(2)
		}
	},
	table: {},
	switch: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		cursor: 'pointer',
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
	const view = useSelector(selectView)
	console.log('arbitrages', arbitrages)

	const [graph, setGraph] = useState(last || defaultGraph)
	const [cycleToggle, setCycleToggle] = useState(false)

	const path = cycleToggle ? graph.cycle : graph

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


	// console.log('moment formatted', moment.utc(data.timestamp).local().format("D MMM YYYY HH:mm Z"))
	// console.log('moment formatted', moment.unix(data.timestamp).format("D MMM YYYY HH:mm:ss Z"))

	if (view.loading) {
		return <LoadingIndicator/>
	}

	return (
		<Page>
			{!view.code ? <GraphContainer elements={createElements(path, getCurrencies(path.nodes), cycleToggle)}/> : <span>{view.message}</span>}
			<div className={classes.information}>
				<span>Last 10 arbitrage opportunities</span>
				<HistoryTable className={classes.table} items={arbitrages} selected={graph.id} onCellClick={setGraph}/>
				<div className={classes.switch} onClick={() => setCycleToggle(!cycleToggle)}>
					<Switch checked={cycleToggle} size={'small'}/>
					<span>Show Cycle</span>
				</div>
			</div>
		</Page>
	)
}

export default Home