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

  getAll () {
    return this.dispatch({
      [CALL_API]: {
        endpoint: '/arbitrages'
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

}