/**
 * Created by Drita Shujaku on 16/07/2020
 */


import { CALL_API } from 'middleware/Api'

/**
 * General ArbitrageService
 */
export default class ArbitrageService {

  constructor (dispatch) {
    this.dispatch = dispatch
  }

  getAll (limit = 20, skip = 0) {
    const data = {
      limit,
      skip
    }
    const params = new URLSearchParams(data)
    return this.dispatch({
      [CALL_API]: {
        endpoint: `/arbitrages?${params}`
      }
    })
  }

  search (item) {
    const url = '/arbitrage'
    // const requestParams = params ? '/?' + new URLSearchParams(params) : ''
    return this.dispatch({
      [CALL_API]: {
        endpoint: '/arbitrage',
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        }
      }
    })
  }


  top (limit = 8) {
    return this.dispatch({
      [CALL_API]: {
        endpoint: `/top?limit=${limit}`
      }
    })
  }

}