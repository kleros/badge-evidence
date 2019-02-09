import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import ArbitrableTokenList from '../assets/contracts/arbitrable-token-list.json'
import { eth, FILE_BASE_URL, T2CR_URL } from '../bootstrap/dapp-api'

import './app.css'
import './evidence.css'

class Evidence extends Component {
  state = {
    token: null
  }

  componentDidMount() {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onmessage = this.receiveEvidence.bind(this)
  }

  async receiveEvidence(message) {
    if (
      !message.data ||
      message.data.target !== 'evidence' ||
      !message.data.arbitrableContractAddress ||
      !message.data.disputeID
    )
      return

    const arbitrableTokenList = eth
      .contract(ArbitrableTokenList.abi)
      .at(message.data.arbitrableContractAddress)

    const ID = await arbitrableTokenList.disputeIDToTokenID(
      message.data.disputeID
    )
    const token = await arbitrableTokenList.getTokenInfo(ID[0])
    token.ID = ID[0]
    this.setState({ token })
  }

  onImgError = e => {
    e.target.style.display = 'none'
  }

  render() {
    const { token } = this.state
    if (!token) return null

    const symbolURI = `${FILE_BASE_URL}/${token.symbolMultihash}`
    return (
      <div className="Evidence">
        <h4>The Token in Question:</h4>
        <div className="Evidence-data">
          <img className="Evidence-symbol" src={symbolURI} alt="Avatar" />
          <div className="Evidence-data-card">
            <div
              className="Evidence-container"
              style={{ overflowX: 'initial' }}
            >
              <p className="Evidence-container-name">
                <b>{token.name}</b>
              </p>
              <p className="Evidence-container-ticker">{token.ticker}</p>
            </div>
            <div className="Evidence-data-separator" />
            <div className="Evidence-container">
              <p className="Evidence-container-multiline Evidence-label">
                Address
              </p>
              <p className="Evidence-container-multiline Evidence-value">
                {token.addr}
              </p>
              <a
                className="Evidence-link"
                href={`${T2CR_URL}/token/${token.ID}`}
              >
                <p
                  className="Evidence-container-multiline"
                  style={{ marginTop: '10px' }}
                >
                  View Submission
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const App = () => (
  <div id="router-root">
    <Helmet>
      <title>T2CR - Evidence Display</title>
    </Helmet>
    <Evidence />
  </div>
)

export default App
