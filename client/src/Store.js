import { createBrowserHistory } from 'history'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'middleware/Thunk'
import logger from 'middleware/Logger'
import api from 'middleware/Api'
import theme from 'reducers/Theme'
import arbitrages from 'reducers/Arbitrages'
import view from 'reducers/ArbitragesView'

export const history = createBrowserHistory()

const reducers = combineReducers({
  theme,
  arbitrages,
  view
})

const middleware = [api, thunk, logger]

const store = createStore(reducers, applyMiddleware(...middleware))

export default store
