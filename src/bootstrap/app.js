import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import ArbitrableTokenList from '../assets/contracts/arbitrable-token-list.json'
import { eth, FILE_BASE_URL } from '../bootstrap/dapp-api'

import './t2cr-evidence.css'
import './app.css'

class TCREvidence extends Component {
  state = {
    token: null
  }

  componentDidMount() {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onmessage = this.receiveEvidence.bind(this)
    window.parent.postMessage(
      // TODO: Remove after testing.
      {
        target: 'evidence',
        loaded: true,
        arbitrableContractAddress: '0xca84015a9f19c17292fbd40aa0a0135f3d7d3901',
        disputeID: 19
      },
      '*'
    )
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
      <div className="TCREvidence">
        <h4>The Token in Question:</h4>
        <div className="TCREvidence-data">
          <a
            className="TCREvidence-symbol"
            href={symbolURI}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="TCREvidence-symbol-image"
              src={symbolURI}
              onError={this.onImgError}
              alt="Token Symbol"
            />
          </a>
          <div className="TCREvidence-text">
            <div>Name: {token.name}</div>
            <div>Ticker: {token.ticker}</div>
            <div>Address: {token.addr}</div>
            <div>Symbol Multihash: {token.symbolMultihash}</div>
            <div>ID: {token.ID}</div>
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
    <TCREvidence />
  </div>
)

export default App
