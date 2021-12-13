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

const buttonColor = '#455972' // '#066ebb'

const useStyles = makeStyles(({palette, spacing, typography, transitions, size: {rem, captionFont}}) => ({
	root: {
		flexFlow: 'row'
	},
	container: {
		width: '100%',
		minHeight: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	title: {
		...typography.h4,
		marginTop: 0,
		marginBottom: 0,
		wordSpacing: '50em'
	},
	subHeader: {
		...typography.h6,
		maxWidth: rem(340),
		color: palette.text.primary,
		// color: '#6989a9',
	},
	text: {
		color: palette.text.secondary,
		...typography.body1
	},
	graphContainer: {
		// backgroundColor: '#222426',
		borderRadius: spacing(),
		flex: `0 0 54%`,
		paddingLeft: rem(spacing(2)),
		paddingRight: rem(spacing(2)),
		margin: '0 auto',
		// height: `calc(100vh - ${spacing(4)}px)`,
		// width: 'min-content',
		// display: 'flex',
		position: 'sticky',
		top: 0,
		right: 0
	},
	leftSection: {
		// display: 'flex',
		// flexFlow: 'column',
		flexGrow: 1,
		marginTop: rem(spacing(3)),
		marginBottom: rem(spacing(3)),
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: rem(spacing(3)),
		maxWidth: '40%',
		height: 'fit-content',
		'& > *:not(:last-child)': {
			marginBottom: rem(spacing(3))
		}
	},
	intro: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: `calc(100vh - ${rem(spacing(6))})`,
		background: `linear-gradient(150deg, ${fade('#008FFF',0.35)} 0%, ${fade('#0D17FF',0.35)} 100%)`,
		borderRadius: spacing(1),
		padding: rem(spacing(2)),
	},
	currencies: {
		display: 'flex',
		flexFlow: 'row wrap',
		borderRadius: spacing(1),
		backdropFilter: 'blur(4px) brightness(0.85)',
		width: '100%',
		padding: rem(spacing(2)),
		alignItems: 'baseline',
		alignContent: 'start',
		overflowY: 'overlay',
		fontSize: rem(captionFont)
	},
	pair: {
		// border: `1px solid ${palette.border}`,
		borderRadius: spacing(2),
		padding: `${rem(spacing(1 / 2))} ${rem(spacing(1))}`,
		marginRight: rem(spacing(1)),
		marginBottom: rem(spacing(1)),
		border: `1px solid ${buttonColor}`,
		color: buttonColor,
		fontWeight: 500,
		cursor: 'pointer',
		transition: transitions.create('all', transitions.duration.shorter, transitions.easing.easeInOut),
		'&$selectedPair': {
			backgroundColor:  fade(buttonColor, 0.4),
			border: `1px solid ${fade(buttonColor, 0.4)}`,
			color: palette.text.primary
		}
	},
	selectedPair: {},
	information: {
		display: 'flex',
		flexFlow: 'column',
		color: palette.text.primary,
		height: '100%',
		padding: rem(spacing(2)),
		justifyContent: 'center',
		backdropFilter: 'blur(4px) brightness(1.25)',
		background: `linear-gradient(
			150deg, ${fade('#1b1b1f', 0.45)} 0%, ${fade('#232428', 0.45)} 100%)`,
		borderRadius: spacing(1),
		'& > *:not(:last-child)': {
			marginBottom: rem(spacing(2))
		}
	},
	tableCaption: {
		...typography.body1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	table: {
		fontSize: rem(captionFont),
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
	chartWrapper: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: spacing(1),
		// backdropFilter: 'blur(4px) brightness(0.85)',
		backgroundColor: '#33325c', // '#303a41', // '#72647f',
		// background: 'linear-gradient(168deg, #33325c 50%, #233462 100%)'
	},
	chartTitle: {
		...typography.body1,
		color: palette.text.primary,
		padding: rem(spacing(2)),
		paddingBottom: 0
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
				<article className={classes.intro}>
					<h1 className={classes.title}>Cryptocurrency Arbitrage</h1>
					<h3 className={classes.subHeader}>
						An arbitrage finder for crypto & fiat markets within an exchange.
					</h3>
					<p className={classes.text}><strong>Select markets</strong> to be used in the calculations:</p>
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
				</article>
				<article className={classes.information}>
					<div className={classes.tableCaption}>
						<span><strong>Last 10 arbitrage opportunities</strong></span>
					</div>
					<HistoryTable className={classes.table} items={arbitrages} selected={graph.id} onCellClick={setGraph}/>
				</article>
				<article className={classes.chartWrapper}>
					<span className={classes.chartTitle}><strong>Top 8 arbitrage opportunities</strong></span>
					<Chart data={configureChartData(chartData)} onClick={index => setGraph(chartData[index])}/>
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