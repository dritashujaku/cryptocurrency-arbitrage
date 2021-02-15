import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(({palette, spacing}) => ({
  root: {
    height: '100%',
    display: 'flex',
    backgroundColor: palette.background.main,
    color: palette.primary.contrastText,
    position: 'relative',
    overflowY: 'auto',
    padding: spacing(2)
  }
}))

const Page = (props) => {

  const { children } = props
  const classes = useStyles(props)

  return (
      <div className={classes.root}>
        {children}
      </div>
  )
}

export default Page