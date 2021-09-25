import { hot } from 'react-hot-loader/root'
import React, { Fragment, lazy, Suspense } from 'react'
import 'assets/app.css'
import store, { history } from 'Store'
import ThemeProvider from 'utils/ThemeProvider'
import { Router, Route, Switch } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import { Provider } from 'react-redux'
import LoadingIndicator from 'utils/LoadingIndicator'

const Home = lazy(() => import('pages/Home'))

const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <Fragment>
        <CssBaseline/>
        <Router history={history}>
          <Suspense fallback={<LoadingIndicator />}>
            <Switch>
              <Route path={'/'}>
                <Home/>
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </Fragment>
    </ThemeProvider>
  </Provider>
)

export default App // hot(App)
