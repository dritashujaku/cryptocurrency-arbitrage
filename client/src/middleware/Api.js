import 'whatwg-fetch'
import { API_URL } from 'Constants'

const callApi = ({endpoint, options: optionsFromCall = {}}, store) => {
  const url = API_URL + endpoint
  console.log(`callig API: ${url}`)
  let options = {
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client,
    ...optionsFromCall
  }
  return fetch(url, options)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response
        }
        const error = {
          status: response.status,
          message: response.statusText
        }
        throw error
      }).then(response => {
        return response.json()
      }).then(json => {
        console.log(`Success at ${url}`, json)
        return json
      })
}


export const CALL_API = Symbol('Call API')

/**
 * Intercepts CALL_API actions to perform the call to the API server
 */
export default store => next => action => {
  const call = action[CALL_API]
  // Only apply this middleware if we are calling an API
  if (typeof call === 'undefined') {
    return next(action)
  }
  return callApi(call, store)
}