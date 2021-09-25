/**
 * Created by Drita Shujaku on 15/07/2020
 */

import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core'
import Page from 'pages/Page'
import {useDispatch, useSelector} from 'react-redux'
import GraphContainer from 'containers/GraphContainer'
import {loadArbitrages, searchArbitrage} from 'reducers/ArbitragesActions'
import {selectArbitrages} from 'reducers/Arbitrages'
import {pairSymbols, symbols, getCurrencies} from 'utils/currencies'
import {createElements, createGraph, createGraphFromOrders, createGraphFromTickers} from 'utils/helper-functions'
import ccxt from 'ccxt'


const useStyles = makeStyles(({palette, size}) => ({
	container: {
		width: '100%',
		height: '100%',
		paddingRight: size.spacing
	}
}))

const exchange = 'kraken' // huobijapan, aax, binance, coinbase, huobipro, okex, bitstamp, lmax

const options = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json'
	},
	redirect: 'follow',
	referrer: 'no-referrer'
	//Authorization: `Apikey ${API_KEY}`
}

const getAssetPairs = async () => {
	const api_key = '242834de20228bbe411926b94345dfbbab2da39a8ac1514d7a1165cbd9984d58'

	const url = 'https://min-api.cryptocompare.com/data/pricemulti' //'https://api.kraken.com/0/public/AssetPairs'
	const params = new URLSearchParams({
		fsyms: symbols,
		tsyms: symbols,
		tryConversion: false,
		relaxedValidation: true,
		e: exchange,
		api_key
	})
	const endpoint = `${url}?${params}`

	const response = await fetch(endpoint, options)
	console.log('call at', endpoint)
	return await response.json()
}


const defaultGraph = {nodes: [], edges: []}

const pairs = symbols.reduce((acc, symbol) => {
	const symbolQuotes = symbols.reduce((accumulator, current) => {
		if (symbol === current) {
			return accumulator
		}
		return accumulator.concat(`${symbol}/${current}`)
	}, [])
	return acc.concat(symbolQuotes)
}, [])

const Home = props => {

	const {} = props

	const classes = useStyles()

	const dispatch = useDispatch()
	const arbitrages = useSelector(selectArbitrages)

	const [graph, setGraph] = useState(defaultGraph)  // createGraph(rates)
	const [exchange, setExchange] = useState(new ccxt.binance({
		enableRateLimit: true,
		proxy: 'http://localhost:8081/'
	}))

	const {rateLimit = 0} = exchange

	const secs = 10
	const delay = secs * 1000

	let timesCalled = 1

	const findArbitrage = () => {
		getAssetPairs().then(response => {
			console.log('response from server', response)
			// setRates(response)
			return createGraph(response, exchange)
		})
			.then(item => {
				setGraph(item)
				dispatch(searchArbitrage(item))
				return item
			})
	}

	const findArbitrageFromTickers = () => {
		if (!exchange) {
			return
		}
		exchange.fetchBidsAsks(pairSymbols) //
			.then(result => {
				console.log('bid/ask result', result)
				return result
			}, error => console.error(error))
			.then(result => {
				return createGraphFromOrders(result, 'binance')
			})
			.then(item => {
				setGraph(item)
				dispatch(searchArbitrage(item))
				return item
			})
	}


	const ws = new WebSocket("ws://localhost:9004/ws")
	ws.onmessage = event => {
		console.log('message from server', event.data)
	}

	ws.onopen = event => {
		ws.send('binance')
	}

	useEffect(() => {
		// ws.send('binance')
	}, [])

/*	useEffect(() => {
		// console.log('pairs', symbols.length, pairs)
		/!*    exchange.loadMarkets().then(result => {
					console.log('markets', Object.keys(result).length, result)
					return result
				}, error => console.error(error))*!/
		// console.log('bitfinex has fetchTickers', exchange.has['fetchTickers'])
		findArbitrageFromTickers()
		dispatch(loadArbitrages())
		let timerId = setTimeout(function loadPrices() {
			console.log('timesCalled', ++timesCalled)
			findArbitrageFromTickers()
			timerId = setTimeout(loadPrices, rateLimit)
		}, rateLimit)

	}, [])*/


	// console.log('moment formatted', moment.utc(data.timestamp).local().format("D MMM YYYY HH:mm Z"))
	// console.log('moment formatted', moment.unix(data.timestamp).format("D MMM YYYY HH:mm:ss Z"))


	return (
		<Page>
			<div className={classes.container}>
				<div>Arbitrages found so far: {arbitrages.length}</div>
				<GraphContainer elements={createElements(graph, getCurrencies(graph.nodes))}/>
			</div>
		</Page>
	)
}

export default Home