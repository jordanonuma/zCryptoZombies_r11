const axios = require('axios')
const BN = require('bn.js')
const common = require('./utils/common.js')
const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 2000
const PRIVATE_KEY_FILE_NAME = process.env.PRIVATE_KEY_FILE || './oracle/oracle_private_key'
const CHUNK_SIZE = process.env.CHUNK_SIZE || 3
const MAX_RETRIES = process.env.MAX_RETRIES || 5
const OracleJSON = require('./oracle/contracts/EthPriceOracle.json') //file assumed to have been created
var pendingRequests = []

async function getOracleContract(web3js) {
    const networkId = await web3js.eth.net.getId()
    return new web3js.eth.Contract(OracleJSON.abi, OracleJSON.networks[networkId].address)
} //end function getOracleContract()

async function filterEvents(oracleContract, web3js) {
    oracleContract.events.GetLatestEthPriceEvent(async (err, event) => {
        if (err) {
            console.error('Error on event', err)
            return
        }
        
        await addRequestToQueue(event)
    }) //end oracleContract.events.GetLatestEthPriceEvent()

    oracleContract.events.SetLatestEthPriceEvent(async (err, event) => {
        if (err) {
            console.error('Error on event', err)
            return
        }
    
    
    }) //end oracleContract.events.SetLatestEthPriceEvent()
} //end function filterEvents()

async function addRequestToQueue(event) {
    const callerAddress = event.returnValues.callerAddress
    const id  = event.returnValues.id
    pendingRequests.push({ callerAddress, id })
} //end function addRequestToQueue()

async function processQueue(oracleContract, ownerAddress) {
    let processedRequests = 0
    while (pendingRequests.length > 0 && processedRequests < CHUNK_SIZE) {
        const req = pendingRequests.shift()
        await processRequest(oracleContract, ownerAddress, req.id, req.callerAddress)
        processedRequests++
    } //end while()
} //end function processQueue()

async function processRequest(oracleContract, ownerAddress, id, callerAddress) {
    let retries = 0
    while (retries < MAX_RETRIES) {
        try {

        } catch (error) {
            
        } //end try-catch{}
    } //end while()
} //end function processRequest()