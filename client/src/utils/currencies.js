export const symbols = [
	'BTC', 'ETH', 'DOGE', 'USDT', 'USD', 'EUR', 'XRP', 'BCH', 'BSV', 'ADA', 'LTC', 'BNB', 'CRO', 'EOS', 'LINK', 'XTZ', 'XLM', 'TRX', 'XMR',
	'GBP', 'CHF', 'CAD'
]

export const pairSymbols = [
	'ADA/EUR',
	'ADA/ETH',
	'ADA/USD',
	'ADA/USDT',
	'ADA/BTC',
	// 'DAI/USDT',
	'DOT/ETH',
	'DOT/USDT',
	'DOT/EUR',
	'DOT/BTC',
	'UNI/ETH',
	'UNI/USDT',
	'UNI/EUR',
	'UNI/BTC',
	'ETH/USDT',
	'LINK/ETH',
	'LINK/EUR',
	'LINK/USDT',
	'LINK/BTC',
	'NANO/ETH',
	'NANO/BTC',
	'NANO/USDT',
	'DOGE/USDT',
	'DOGE/EUR',
	'DOGE/BTC',
	'LTC/BTC',
	'LTC/USD',
	'LTC/USDT',
	'LTC/EUR',
	'XRP/ETH',
	'XRP/USD',
	'XRP/USDT',
	'XRP/BTC',
	'XRP/EUR',
	'BTC/EUR',
	'BTC/USD',
	'BTC/USDT',
	// 'BTC/DAI',
]

export const getCurrencies = (symbols = []) => symbols
	.reduce((acc, current) => {
		let color, black
		try {
			color = require(`cryptocurrency-icons/svg/color/${current.toLowerCase()}.svg`)
			black = require(`cryptocurrency-icons/svg/black/${current.toLowerCase()}.svg`)
		} catch {
			color = require(`cryptocurrency-icons/svg/color/generic.svg`)
			black = require(`cryptocurrency-icons/svg/black/generic.svg`)
		}

		return {
			...acc,
			[current]: {
				svg: {
					black,
					color
				}
			}
		}
	}, {})

const rs = {
	'LTC/BTC': {
		symbol: 'LTC/BTC',
		timestamp: null,
		datetime: null,
		high: null,
		low: null,
		bid: 0.003641,
		bidVolume: 78.33,
		ask: 0.003642,
		askVolume: 136.1,
		vwap: null,
		open: null,
		close: null,
		last: null,
		previousClose: null,
		change: null,
		percentage: null,
		average: null,
		baseVolume: null,
		quoteVolume: null,
		info: {
			symbol: 'LTCBTC',
			bidPrice: 0.00364100,
			bidQty: 78.33000000,
			askPrice: 0.00364200,
			askQty: 136.10000000
		}
	}
}