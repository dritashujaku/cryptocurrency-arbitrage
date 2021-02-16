export default {
  '_id': '5ff4bd1cc895239ad622c708',
  'data': {
    'USD': {
      'USD': 1,
      'EUR': 0.741,
      'GBP': 0.657,
      'CHF': 1.061,
      'CAD': 1.005
    },
    'EUR': {
      'USD': 1.349,
      'EUR': 1,
      'GBP': 0.888,
      'CHF': 1.433,
      'CAD': 1.366
    },
    'GBP': {
      'USD': 1.521,
      'EUR': 1.126,
      'GBP': 1,
      'CHF': 1.614,
      'CAD': 1.538
    },
    'CHF': {
      'USD': 0.942,
      'EUR': 0.698,
      'GBP': 0.619,
      'CHF': 1,
      'CAD': 0.953
    },
    'CAD': {
      'USD': 0.995,
      'EUR': 0.732,
      'GBP': 0.65,
      'CHF': 1.049,
      'CAD': 1
    }
  },
  'edges': [
    {'source': 'USD', 'target': 'EUR', 'quote': 0.741},
    {'source': 'EUR', 'target': 'CAD', 'quote': 1.366},
    {'source': 'CAD', 'target': 'USD', 'quote': 0.995}
  ],
  'exchange': 'kraken',
  'nodes': ['USD', 'EUR', 'CAD'],
  'profit': 0.007144970000000139,
  'timestamp': 1609874709195
}

export const jsonResponse = {
  "nodes": [
    "USD",
    "EUR",
    "CAD"
  ],
  "edges": [
    {
      "source": "USD",
      "target": "EUR",
      "quote": 0.741
    },
    {
      "source": "EUR",
      "target": "CAD",
      "quote": 1.366
    },
    {
      "source": "CAD",
      "target": "USD",
      "quote": 0.995
    }
  ],
  "profit": 0.007144970000000139,
  "exchange": "kraken",
  "data": {
    "USD": {
      "USD": 1,
      "EUR": 0.741,
      "GBP": 0.657,
      "CHF": 1.061,
      "CAD": 1.005
    },
    "EUR": {
      "USD": 1.349,
      "EUR": 1,
      "GBP": 0.888,
      "CHF": 1.433,
      "CAD": 1.366
    },
    "GBP": {
      "USD": 1.521,
      "EUR": 1.126,
      "GBP": 1,
      "CHF": 1.614,
      "CAD": 1.538
    },
    "CHF": {
      "USD": 0.942,
      "EUR": 0.698,
      "GBP": 0.619,
      "CHF": 1,
      "CAD": 0.953
    },
    "CAD": {
      "USD": 0.995,
      "EUR": 0.732,
      "GBP": 0.65,
      "CHF": 1.049,
      "CAD": 1
    }
  },
  "timestamp": "2021-01-07T17:08:54.796000",
  "id": "5ff740b2624cff50092bd62b"
}

export const cryptoCompareResponse = {
  USD: {
    EUR: 0.741,
    GBP: 0.657,
    CHF: 1.061,
    CAD: 1.005
  },
  EUR: {
    USD: 1.349,
    GBP: 0.888,
    CHF: 1.433,
    CAD: 1.366
  },
  GBP: {
    USD: 1.521,
    EUR: 1.126,
    CHF: 1.614,
    CAD: 1.538
  },
  CHF: {
    USD: 0.942,
    EUR: 0.698,
    GBP: 0.619,
    CAD: 0.953
  },
  CAD: {
    USD: 0.995,
    EUR: 0.732,
    GBP: 0.650,
    CHF: 1.049
  }
}