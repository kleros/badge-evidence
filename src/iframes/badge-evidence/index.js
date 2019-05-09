import React, { Component } from 'react'

import ArbitrableAddressList from '../../assets/contracts/arbitrable-address-list.json'
import ArbitrableTokenList from '../../assets/contracts/arbitrable-token-list.json'
import {
  eth,
  T2CR_URL,
  web3,
  T2CR_ADDRESS,
  IPFS_URL
} from '../../bootstrap/dapp-api'
import UnknownToken from '../../assets/unknown.svg'

import './t2cr-evidence.css'

class BadgeEvidence extends Component {
  state = {
    badgeAddress: null,
    tokenAddress: null
  }

  async componentDidMount() {
    if (window.location.search[0] !== '?') return
    const message = JSON.parse(
      window.location.search
        .substring(1)
        .replace(/%22/g, '"')
        .replace(/%7B/g, '{')
        .replace(/%3A/g, ':')
        .replace(/%2C/g, ',')
        .replace(/%7D/g, '}')
    )

    const {
      disputeID,
      arbitrableContractAddress,
      arbitratorContractAddress
    } = message

    if (!arbitrableContractAddress || !disputeID || !arbitratorContractAddress)
      return

    const arbitrableAddressList = eth
      .contract(ArbitrableAddressList.abi)
      .at(arbitrableContractAddress)

    // Get badge information from the latest meta evidence
    const metaEvidence = await getBadgeVariables({
      arbitrableContractAddress,
      web3,
      ArbitrableAddressList
    })

    // Get the token address from the dispute ID.
    const tokenAddress = (await arbitrableAddressList.arbitratorDisputeIDToAddress(
      arbitratorContractAddress,
      disputeID
    ))[0]

    // Get token information, if ever submitted to the T2CR.
    const arbitrableTokenList = eth
      .contract(ArbitrableTokenList.abi)
      .at(T2CR_ADDRESS)
    const tokenSubmissions = await getTokenSubmissions({
      arbitrableTokenList,
      tokenAddress
    })
    let token
    if (tokenSubmissions.length > 0)
      token = await arbitrableTokenList.getTokenInfo(tokenSubmissions[0])

    this.setState({
      tokenAddress,
      badgeAddress: arbitrableContractAddress,
      metaEvidence,
      token
    })
  }

  onImgError = e => {
    e.target.style.display = 'none'
  }

  render() {
    const { tokenAddress, badgeAddress, metaEvidence } = this.state
    let { token } = this.state
    if (!tokenAddress || !badgeAddress) return null

    if (token) token.symbolMultihash = `${IPFS_URL}${token.symbolMultihash}`
    else
      token = {
        symbolMultihash: UnknownToken,
        name: 'Unknown Token',
        ticker: '',
        addr: tokenAddress
      }

    return (
      <div className="TTCREvidence">
        <h4 style={{ margin: '0 0 6px 0' }}>The Token in Question:</h4>
        <div className="TTCREvidence-cards">
          <div className="TTCREvidence-data-card">
            <img
              className="TTCREvidence-symbol"
              src={token.symbolMultihash}
              alt="token symbol"
            />
            <div className="TTCREvidence-data-separator" />
            <div className="TTCREvidence-container">
              <p className="TTCREvidence-container-name">
                <b>{token.name}</b> {token.ticker}
              </p>
              <p className="TTCREvidence-container-multiline TTCREvidence-label">
                Address
              </p>
              <p className="TTCREvidence-container-multiline TTCREvidence-value">
                {web3.utils.toChecksumAddress(token.addr)}
              </p>
              <a
                className="TTCREvidence-link"
                href={`${T2CR_URL}/badge/${web3.utils.toChecksumAddress(
                  badgeAddress
                )}/${web3.utils.toChecksumAddress(tokenAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p
                  className="TTCREvidence-container-multiline"
                  style={{ marginTop: '10px' }}
                >
                  View Submission
                </p>
              </a>
            </div>
          </div>
          <p className="TTCREvidence-plus">|</p>
          <div className="TTCREvidence-data-card">
            <img
              className="TTCREvidence-symbol"
              src={`${IPFS_URL}/${metaEvidence.variables.symbolURI}`}
              alt="badge symbol"
            />
            <div className="TTCREvidence-data-separator" />
            <div className="TTCREvidence-container">
              <p className="TTCREvidence-container-multiline TTCREvidence-label">
                Badge
              </p>
              <b>{metaEvidence.variables.title}</b>
              <a
                className="TTCREvidence-link"
                href={`${IPFS_URL}/${metaEvidence.fileURI}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p
                  className="TTCREvidence-container-multiline"
                  style={{ marginTop: '10px' }}
                >
                  View Criteria
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const getBadgeVariables = async ({
  arbitrableContractAddress,
  web3,
  ArbitrableAddressList
}) => {
  const arbitrableAddressList = web3.eth.Contract(
    ArbitrableAddressList.abi,
    arbitrableContractAddress
  )
  const metaEvidenceEvents = (await arbitrableAddressList.getPastEvents(
    'MetaEvidence',
    { fromBlock: 0 }
  )).sort((a, b) => a.blockNumber - b.blockNumber)

  const metaEvidencePath = `${IPFS_URL}${
    metaEvidenceEvents[metaEvidenceEvents.length - 1].returnValues._evidence
  }`

  return (await fetch(metaEvidencePath)).json()
}

const getTokenSubmissions = async ({ arbitrableTokenList, tokenAddress }) => {
  const ZERO_ID =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  return (await arbitrableTokenList.queryTokens(
    ZERO_ID,
    10,
    [
      false, // Do not include tokens which are not on the TCR.
      true, // Include registered tokens.
      true, // Include tokens with pending registration requests.
      true, // Include tokens with pending clearing requests.
      true, // Include tokens with challenged registration requests.
      true, // Include tokens with challenged clearing requests.
      true, // Include token if caller is the author of a pending request.
      true // Include token if caller is the challenger of a pending request.
    ],
    true, // Return oldest first.
    tokenAddress
  )).values.filter(tokenID => tokenID !== ZERO_ID)
}

export default BadgeEvidence
