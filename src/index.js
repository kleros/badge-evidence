import React from 'react'
import ReactDOM from 'react-dom'

import App from './bootstrap/app'

const render = () => {
  ReactDOM.render(
    <App
      key={process.env.NODE_ENV === 'development' ? Math.random() : undefined}
    />,
    document.getElementById('root')
  )
}

render(App)

if (module.hot)
  module.hot.accept('./bootstrap/app', () => {
    render(App)
  })
