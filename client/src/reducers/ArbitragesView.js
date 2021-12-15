import ACTIONS from 'reducers/ArbitragesActionTypes'


const defaultState = {
  loading: false,
  message: '',
  status: 200
}

const view = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_DATA:
      return {...defaultState, loading: true}
    case ACTIONS.RECEIVE_DATA:
      return {...defaultState, loading: false}
    case ACTIONS.ERROR_OCCURRED:
      const {error} = action
      return {...defaultState, loading: false, ...error}
    default:
      return state
  }
}

export const selectView = state => state.view

export default view