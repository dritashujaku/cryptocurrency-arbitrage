import React from 'react'
import Theme from 'utils/Theme'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { connect } from 'react-redux'

const ThemeProvider = (props) => {
  const { children, type } = props
  const theme = createMuiTheme(Theme.getTheme(type))
  console.log('theme', theme)

  return (
      <MuiThemeProvider theme={theme}>
        { children }
      </MuiThemeProvider>
  )
}

const mapStateToProps = (state) => ({
  type: state.theme
})

export default connect(mapStateToProps)(ThemeProvider)