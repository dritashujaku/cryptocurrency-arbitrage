import { CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(({}) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  }
}))

const LoadingIndicator = (props) => {
  const classes = useStyles()
  return (
      <div className={classes.root}>
        <CircularProgress color={'secondary'} {...props}/>
      </div>
  )
}

export default LoadingIndicator