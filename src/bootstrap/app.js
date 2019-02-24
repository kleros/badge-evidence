import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import TTCREvidence from '../iframes/t2cr-evidence'
import BadgeEvidence from '../iframes/badge-evidence'

import './app.css'

const App = () => (
  <>
    <Helmet>
      <title>Tokens on Trial</title>
    </Helmet>
    <Router>
      <Switch>
        <Route component={TTCREvidence} exact path="/t2cr" />
        <Route component={BadgeEvidence} exact path="/badge" />
      </Switch>
    </Router>
  </>
)

export default App
