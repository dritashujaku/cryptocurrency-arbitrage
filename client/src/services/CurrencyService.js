const ccxt = require('ccxt')

/*(async function () {

    const getSample = size => object => {
        return Object.entries(object).reduce((acc, [key, value], index) => {
            if (index < size) {
                return {...acc, [key]: value}
            }
            return acc
        }, {})
    }

    const getThree = getSample(3)

    let kraken = new ccxt.kraken()
    // let bitfinex = new ccxt.bitfinex({verbose: true})
    // let huobipro = new ccxt.huobipro()

    const markets = await kraken.loadMarkets()

    console.log('load markets', kraken.id, await getThree(markets))
    // console.log(bitfinex.id, await bitfinex.loadMarkets())
    // console.log(huobipro.id, await huobipro.loadMarkets())

    const orderBook = await kraken.fetchOrderBook(kraken.symbols[0])

    console.log('order book', kraken.id, await getThree(orderBook))
    // console.log(bitfinex.id, await bitfinex.fetchTicker('BTC/USD'))
    // console.log(huobipro.id, await huobipro.fetchTrades('ETH/USDT'))

    console.log('kraken functions', kraken)
    let pairs = await kraken.publicGetSymbolsDetails ()
    let marketIds = Object.keys (pairs['result'])
    let marketId = marketIds[0]
    let ticker = await kraken.fetchTicker (marketId)
    console.log ('ticker', kraken.id, marketId, ticker)
})()*/

const getSample = size => object => {
    return Object.entries(object).reduce((acc, [key, value], index) => {
        if (index < size) {
            return {...acc, [key]: value}
        }
        return acc
    }, {})
}

const getThree = getSample(3)

// const kraken = new ccxt.kraken()
//
// const markets = kraken.loadMarkets().then(result => {
//     // console.log('result', result)
//     return getThree(result)
// }, error => error)
//
// markets.then(response => console.log('response', response))

// kraken.fetchTicker('BTC/USD').then(result => {
//     console.log('ticker result', result)
//     return result
// }, error => console.error(error))
//
//
// kraken.fetchOrderBook('BTC/USD').then(result => {
//     console.log('bids', result.bids.slice(0, 10))
//     console.log('asks', result.asks.slice(0, 10))
//     return result
// }, error => console.error(error))
//
// kraken.fetchCurrencies().then(result => {
//     console.log('currencies', result)
//     return result
// }, error => console.error(error))

const binance = new ccxt.binance()

binance.loadMarkets().then(() => {
    console.log('markets loaded')
    binance.fetchBidsAsks(['ADA/EUR', 'BTC/USDT', 'USDT/BTC', 'XRP/ETH',	'LTC/USDT']).then(response => {
        console.log('response from fetchBidsAsks', response)
    })
})

