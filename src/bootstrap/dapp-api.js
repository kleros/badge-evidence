import Eth from 'ethjs'
import Web3 from 'web3'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const IPFS_URL = process.env[`REACT_APP_${env}_IPFS_URL`]
const T2CR_URL = process.env[`REACT_APP_${env}_T2CR_URL`]
const T2CR_ADDRESS = process.env[`REACT_APP_${env}_T2CR_ADDRESS`]

let eth
let web3
if (process.env.NODE_ENV === 'test') {
  eth = new Eth(require('ganache-cli').provider())
  web3 = new Web3(require('ganache-cli').provider())
} else if (window.ethereum) {
  eth = new Eth(window.ethereum)
  web3 = new Web3(window.ethereum)
} else if (window.web3 && window.web3.currentProvider) {
  eth = new Eth(window.web3.currentProvider)
  web3 = new Web3(window.web3.currentProvider)
} else {
  eth = new Eth(new Eth.HttpProvider(ETHEREUM_PROVIDER))
  web3 = new Web3(ETHEREUM_PROVIDER)
}

export { eth, IPFS_URL, T2CR_URL, web3, T2CR_ADDRESS }
