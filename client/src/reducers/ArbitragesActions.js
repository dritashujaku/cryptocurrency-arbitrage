import ACTIONS from 'reducers/ArbitragesActionTypes'
import ArbitrageService from 'services/ArbitrageService'


const requestData = () => ({
  type: ACTIONS.REQUEST_DATA
})

const receiveData = data => ({
  type: ACTIONS.RECEIVE_DATA,
  data
})

export const update = item => ({
  type: ACTIONS.ADD_ARBITRAGE,
  item
})

const errorOccurred = error => ({
  type: ACTIONS.ERROR_OCCURRED,
  error
})

export const loadArbitrages = () => dispatch => {
  const service = new ArbitrageService(dispatch)
  dispatch(requestData())
  return service.getAll().then(response => {
    dispatch(receiveData(response))
    return response
  }, error => {
    dispatch(errorOccurred(error))
    return error
  })
}

export const searchArbitrage = item => dispatch => {
  const service = new ArbitrageService(dispatch)
  return service.search(item).then((response = {}) => {
    const {cycle} = response
    if (!!cycle) {
      dispatch(update(response))
    }
    return response
  }, error => {
    dispatch(errorOccurred(error))
    return error
  })
}
