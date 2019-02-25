import Eth from 'ethjs'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const FILE_BASE_URL = process.env[`REACT_APP_${env}_FILE_BASE_URL`]
const T2CR_URL = process.env[`REACT_APP_${env}_T2CR_URL`]

let eth
if (process.env.NODE_ENV === 'test')
  eth = new Eth(require('ganache-cli').provider())
else if (window.ethereum) eth = new Eth(window.ethereum)
else if (window.web3 && window.web3.currentProvider)
  eth = new Eth(window.web3.currentProvider)
else eth = new Eth(new Eth.HttpProvider(ETHEREUM_PROVIDER))

export { eth, FILE_BASE_URL, T2CR_URL }
