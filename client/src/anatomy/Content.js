import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(({palette}) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row wrap',
    backgroundColor: palette.background.main,
    height: '100vh',
    overflow: 'hidden',
    color: palette.text.default,
  }
}))

const Content = (props) => {

  const { children } = props
  const classes = useStyles()

  return (
      <div className={classes.root}>
        {children}
      </div>
  )
}

export default Content