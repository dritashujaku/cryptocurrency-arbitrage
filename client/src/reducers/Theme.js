const ACTION_TYPES = {
  SWITCH_THEME:'SWITCH_THEME'
}

export const switchTheme = (theme) => ({
  type: ACTION_TYPES.SWITCH_THEME,
  theme
})

const theme = (state = 'dark', action) => {
  switch (action.type) {
    case ACTION_TYPES.SWITCH_THEME:
      return action.theme
    default:
      return state
  }
}

export default theme