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

const sortItems = items => {
  // sort from latest
  return [...items].sort((a, b) => b.timestamp - a.timestamp)
}

export const selectArbitrages = state => state.arbitrages

export const selectSortedArbitrages = createSelector(
  selectArbitrages,
  sortItems
)

export const selectLastArbitrage = createSelector(
  selectSortedArbitrages,
  items => {
    if (items.length > 0) {
      return items[0]
    }
    return null
  }
)

export default arbitrages