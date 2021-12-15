/**
 * Created by Drita Shujaku on 15/07/2020
 */

import React, {useEffect, useRef, useState} from 'react'
import {fade, makeStyles, Switch} from '@material-ui/core'
import Page from 'pages/Page'
import {useDispatch, useSelector} from 'react-redux'
import GraphContainer from 'containers/GraphContainer'
import {loadArbitrages, update} from 'reducers/ArbitragesActions'
import {selectLastArbitrage, selectSortedArbitrages} from 'reducers/Arbitrages'
import {getCurrencies, pairSymbols} from 'utils/currencies'
import {configureChartData, createElements} from 'utils/helper-functions'
import useWebSocket from 'utils/useWebSocket'
import HistoryTable from 'containers/HistoryTable'
import {selectView} from 'reducers/ArbitragesView'
import LoadingIndicator from 'utils/LoadingIndicator'
import classNames from 'classnames'
import ArbitrageService from 'services/ArbitrageService'
import Chart from 'containers/Chart'

const useStyles = makeStyles(({palette, spacing, typography, transitions, size: {rem, captionFont}}) => ({
	root: {
		flexFlow: 'row',
		scrollSnapType: 'y proximity'
	},
	container: {
		width: '100%',
		minHeight: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	leftSection: {
		display: 'flex',
		flexFlow: 'column',
		marginTop: rem(spacing(3)),
		marginBottom: rem(spacing(3)),
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: rem(spacing(3)),
		maxWidth: rem(580),
		height: 'fit-content',
		'& > *:not(:last-child)': {
			marginBottom: rem(spacing(3))
		}
	},
	article: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: `calc(100vh - ${rem(spacing(6))})`,
		scrollSnapAlign: 'center',
		// background: `linear-gradient(150deg, ${fade('#008FFF',0.35)} 0%, ${fade('#0D17FF',0.35)} 100%)`,
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: spacing(1),
		padding: rem(spacing(3)),
		color: palette.text.default,
		backgroundColor: palette.background.card,
		width: '100%',
	},
	title: {
		fontSize: rem(40),
		fontWeight: 700,
		marginTop: 0,
		marginBottom: rem(spacing(2)),
		lineHeight: 1.8,
		// wordSpacing: '50em'
	},
	subHeader: {
		...typography.h6,
		fontWeight: 400,
		maxWidth: rem(340),
		marginTop: 0,
		marginBottom: rem(spacing(2)),
		color: palette.text.primary,
		lineHeight: 1.6
	},
	text: {
		...typography.body1,
		fontWeight: 400,
		color: palette.text.default,
		marginBottom: rem(spacing(1))
	},
	currencies: {
		display: 'flex',
		flexFlow: 'row wrap',
		borderRadius: spacing(1),
		backdropFilter: 'blur(4px) brightness(0.8)',
		// border: `2px solid ${fade(palette.stroke, 0.7)}`,
		width: '100%',
		padding: rem(spacing(1)),
		alignItems: 'baseline',
		alignContent: 'start',
		overflowY: 'overlay',
		fontSize: rem(captionFont)
	},
	pair: {
		borderRadius: spacing(2),
		padding: `${rem(spacing(1 / 2))} ${rem(spacing(1))}`,
		margin: rem(spacing(1 / 2)),
		border: `1px solid ${palette.text.secondary}`,
		color: palette.text.secondary,
		fontWeight: 500,
		cursor: 'pointer',
		transition: transitions.create('all', transitions.duration.shorter, transitions.easing.easeInOut),
		'&$selectedPair': {
			backgroundColor:  fade(palette.button.secondary, 0.4),
			border: `1px solid ${fade(palette.button.secondary, 0.4)}`,
			color: palette.text.default
		}
	},
	selectedPair: {},
	table: {
		justifyContent: 'center',
		backdropFilter: 'blur(4px) brightness(1.25)',
		// background: `linear-gradient(
		// 	150deg, ${fade('#1b1b1f', 0.45)} 0%, ${fade('#232428', 0.45)} 100%)`,
		'& > *:not(:last-child)': {
			marginBottom: rem(spacing(2))
		}
	},
	tableCaption: {
		...typography.h6,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	switch: {
		display: 'flex',
		position: 'fixed',
		right: rem(spacing(5)),
		bottom: rem(spacing(2)),
		padding: spacing(1),
		borderRadius: rem(spacing(3)),
		justifyContent: 'flex-end',
		alignItems: 'center',
		cursor: 'pointer',
		backdropFilter: 'blur(4px) brightness(0.85)',
		// fontSize: rem(captionFont),
		'& > *:not(:last-child)': {
			marginRight: rem(spacing())
		}
	},
	chart: {
		padding: rem(spacing(2))
	},
	chartTitle: {
		...typography.h6,
		color: palette.text.default,
		padding: rem(spacing(2)),
		paddingBottom: 0
	},
	graphContainer: {
		borderRadius: spacing(),
		flex: `0 1 54%`,
		paddingLeft: rem(spacing(2)),
		paddingRight: rem(spacing(2)),
		margin: '0 auto',
		position: 'sticky',
		top: 0,
		right: 0
	}
}))

function shuffle(array) {
	let currentIndex = array.length, randomIndex
	let shuffledArray = [...array]

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		[shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]]
	}

	return shuffledArray
}

const defaultGraph = {nodes: [], edges: [], cycle: {}}

const Home = props => {

	const {} = props

	const classes = useStyles()

	const dispatch = useDispatch()
	const arbitrages = useSelector(selectSortedArbitrages)
	const last = useSelector(selectLastArbitrage)
	const view = useSelector(selectView)
	const service = new ArbitrageService(dispatch)
	const timer = useRef()

	const [graph, setGraph] = useState(last || defaultGraph)
	const [cycleToggle, setCycleToggle] = useState(false)
	const [markets, setMarkets] = useState(pairSymbols)
	const [chartData, setChartData] = useState([])

	const path = cycleToggle ? graph.cycle : graph

	const message = {
		exchange: 'binance',
		pairs: shuffle(markets)
	}

	const onMessage = (ws, data) => {
		// const {current} = timer
		// if (current) {
		// 	clearInterval(current)
		// }
		dispatch(update(data))
		sendMessage(ws)
		// timer.current = setInterval(() => {
		// 	sendMessage(ws)
		// }, 1000 * 60)
	}

	const sendMessage = (ws) => {
		ws.send(JSON.stringify(message))
	}

	const onOpen = ws => {
		sendMessage(ws)
	}

	const {socket} = useWebSocket('ws', onOpen, onMessage)

	useEffect(() => {
		dispatch(loadArbitrages())
		service.top().then(data => {
			setChartData(data)
		})
	}, [])

	useEffect(() => {
		if (!socket) {
			return
		}
		sendMessage(socket)
	}, [markets])

	useEffect(() => {
		if (!last) {
			return
		}
		setGraph(last)
	}, [last])

	if (view.loading) {
		return <LoadingIndicator/>
	}

	const isSelected = item => markets.includes(item)

	const toggleMarket = item => {
		const found = isSelected(item)
		if (found) {
			setMarkets(prevState => prevState.filter(next => next !== item))
			return
		}
		setMarkets(prevState => prevState.concat(item))
	}

	return (
		<Page className={classes.root}>
			<section className={classes.leftSection}>
				<article className={classes.article}>
					<div className={classes.card}>
						<h1 className={classes.title}>Cryptocurrency Arbitrage</h1>
						<h3 className={classes.subHeader}>
							An arbitrage finder for crypto & fiat markets within an exchange.
						</h3>
						<p className={classes.text}>Select markets</p>
						<div className={classes.currencies}>
							{pairSymbols.map((next, index) => (
								<span
									key={next}
									className={classNames(classes.pair, isSelected(next) && classes.selectedPair)}
									onClick={() => toggleMarket(next)}>
								{next}
							</span>
							))}
						</div>
					</div>
				</article>
				<article className={classes.article}>
					<div className={classNames(classes.card, classes.table)}>
						<div className={classes.tableCaption}>
							<span>Last 10 arbitrage opportunities</span>
						</div>
						<HistoryTable items={arbitrages} selected={graph.id} onCellClick={setGraph}/>
					</div>
				</article>
				<article className={classes.article}>
					<div className={classNames(classes.card, classes.chart)}>
						<span className={classes.chartTitle}>Top 8 arbitrage opportunities</span>
						<Chart data={configureChartData(chartData)} onClick={index => setGraph(chartData[index])}/>
					</div>
				</article>
			</section>
			{!view.code ?
				<GraphContainer
					className={classes.graphContainer}
					elements={createElements(path, getCurrencies(path.nodes), cycleToggle)}
				/> :
				<span>{view.message}</span>}
			<div className={classes.switch} onClick={() => setCycleToggle(!cycleToggle)}>
				<Switch checked={cycleToggle} size={'small'} color={'primary'}/>
				<span><strong>Show Cycle</strong></span>
			</div>
		</Page>
	)
}

export default Home