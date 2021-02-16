
export const symbols = [
  'BTC', 'ETH', 'DOGE', 'USDT', 'USD', 'EUR', 'XRP', 'BCH', 'BSV', 'ADA', 'LTC', 'BNB', 'CRO', 'EOS', 'LINK', 'XTZ', 'XLM', 'TRX', 'XMR',
  // 'GBP', 'CHF', 'CAD'
]

const currencies = symbols
  .reduce((acc, current) => {
    let color, black
    try {
      color = require(`cryptocurrency-icons/svg/color/${current.toLowerCase()}.svg`)
      black = require(`cryptocurrency-icons/svg/black/${current.toLowerCase()}.svg`)
    } catch {
      color = require(`cryptocurrency-icons/svg/color/generic.svg`)
      black = require(`cryptocurrency-icons/svg/black/generic.svg`)
    }

    const entry = {
      [current]: {
        svg: {
          black,
          color
        }
      }
    }

    return {
      ...acc,
      ...entry
    }
  }, {})


export default currencies
