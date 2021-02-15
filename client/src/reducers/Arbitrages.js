import ACTIONS from 'reducers/ArbitragesActionTypes'
import { createSelector } from 'reselect'

const arbitrages = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_DATA:
      return action.data
    case ACTIONS.ADD_ARBITRAGE:
      return [...state, action.item]
    default:
      return state
  }
}

export const selectArbitrages = state => state.arbitrages

export default arbitrages