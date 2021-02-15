/**
 * Created by Drita Shujaku on 15/07/2020
 */

import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Page from 'pages/Page'
import { useDispatch, useSelector } from 'react-redux'
import GraphContainer from 'containers/GraphContainer'
import { loadArbitrages, searchArbitrage } from 'reducers/ArbitragesActions'
import { selectArbitrages } from 'reducers/Arbitrages'
import { symbols } from 'utils/currencies'
import currencies from 'utils/currencies'
import { createElements, createGraph } from 'utils/helper-functions'


const useStyles = makeStyles(({palette}) => ({
  container: {
    width: '100%',
    height: '100%'
  }
}))

const exchange = 'binance'

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

const Home = props => {

  const {} = props

  const classes = useStyles()

  const dispatch = useDispatch()
  const arbitrages = useSelector(selectArbitrages)

  const [graph, setGraph] = useState(defaultGraph)  // createGraph(rates)

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

  useEffect(() => {
    findArbitrage()
    dispatch(loadArbitrages())
    let timerId = setTimeout(function loadPrices() {
      console.log('timesCalled', ++timesCalled)
      findArbitrage()
      timerId = setTimeout(loadPrices, delay)
    }, delay)

  }, [])


  // console.log('moment formatted', moment.utc(data.timestamp).local().format("D MMM YYYY HH:mm Z"))
  // console.log('moment formatted', moment.unix(data.timestamp).format("D MMM YYYY HH:mm:ss Z"))


  return (
    <Page>
      <div className={classes.container}>
        <div>Arbitrages found so far: {arbitrages.length}</div>
        <GraphContainer elements={createElements(graph, currencies)}/>
      </div>
    </Page>
  )
}

export default Home