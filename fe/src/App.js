import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/configStore'
import theme from './utils/theme'
import { Header, Sidebard, Footer, Wrapper } from './components/layout'
import routes from './utils/routes'
import LoginModal from './components/common/login/LoginModal'

const purgePersistedData = () => persistor.purge()

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Wrapper>
            <Router basename='/r'>
              <header>
                <Header />
              </header>
              <nav>
                <Sidebard purgePersistedData={purgePersistedData} />
              </nav>
              <LoginModal />
              <Container maxWidth="lg" className="appbody">
                <Switch>
                  {
                    routes.map(r =>
                      <Route {...r} key={r.path} />
                    )
                  }
                  <Route path="*">
                    <Redirect to="/home" />
                  </Route>
                </Switch>
              </Container>
              <footer>
                <Footer />
              </footer>
            </Router>
          </Wrapper>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
