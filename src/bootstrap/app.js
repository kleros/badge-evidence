import React from 'react'
import { Helmet } from 'react-helmet'

import BadgeEvidence from '../iframes/badge-evidence'

import './app.css'

const App = () => (
  <>
    <Helmet>
      <title>Kleros - Evidence Display</title>
    </Helmet>
    <BadgeEvidence />
  </>
)

export default App
