import React from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(({palette, spacing}) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    backgroundColor: palette.background.main,
    color: palette.primary.contrastText,
    position: 'relative',
    overflowY: 'overlay',
    // padding: spacing(2)
  }
}))

const Page = (props) => {

  const { children, className } = props
  const classes = useStyles(props)

  return (
      <main className={classNames(classes.root, className)}>
        {children}
      </main>
  )
}

export default Page