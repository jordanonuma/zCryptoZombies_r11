async function getZkSyncProvider(zksync, networkName) {
    let zkSyncProvider
    try {
        zkSyncProvider = await zksync.getDefaultProvider(networkName)
    } catch (error) {
        console.log('Unable to connect to zkSync.')
        console.log(error)
    }
    return zkSyncProvider
} //end function getZkSyncProvider()

async function getEthereumProvider (ethers, networkName) {
    let ethersProvider
    try {
      // eslint-disable-next-line new-cap
      ethersProvider = new ethers.getDefaultProvider(networkName)
    } catch (error) {
      console.log('Could not connect to Rinkeby')
      console.log(error)
    }
    return ethersProvider
} //end getEthereumProvider()

async function initAccount (rinkebyWallet, zkSyncProvider, zksync) {
    const zkSyncWallet = await zksync.Wallet.fromEthSigner(rinkebyWallet, zkSyncProvider)
    return zkSyncWallet
} //end initAccount()

async function registerAccount (wallet) {
    console.log(`Registering the ${wallet.address()} account on zkSync`)
    if (!await wallet.isSigningKeySet()) {
        if (await wallet.getAccountId() === undefined) {
            throw new Error('Unknown account')
        } //end if()
        const changePubkey = await wallet.setSigningKey()
        await changePubkey.awaitReceipt()
    } //end if()
    console.log(`Account ${wallet.address()} registered`)
} //end registerAccount()

async function depositToZkSync (zkSyncWallet, token, amountToDeposit, tokenSet) {
    const deposit = await zkSyncWallet.depositToSyncFromEthereum({
        depositTo: zkSyncWallet.address(),
        token: token,
        amount: ethers.utils.parseEther(tokenSet.parseToken(token, amountToDeposit))
    })
    try {
        await deposit.awaitReceipt()
    } catch (error) {
        console.log('Error while awaiting confirmation from the zkSync operators.')
        console.log(error)
    }
} //end depositToZkSync()

async function transfer (from, toAddress, amountToTransfer, transferFee, token, zksync, tokenSet) {
    const closestPackableAmount = zksync.utils.closestPackableTransactionAmount(tokenSet.parseToken(token, amountToTransfer))
    const closestPackableFee = zksync.utils.closestPackableTransactionFee(tokenSet.parseToken(token, transferFee))
  
    const transfer = await from.syncTransfer({
      to: toAddress,
      token: token,
      amount: closestPackableAmount,
      fee: closestPackableFee
    })
    const transferReceipt = await transfer.awaitReceipt()
    console.log('Got transfer receipt.')
    console.log(transferReceipt)
} //end transfer()

async function getFee (transactionType, address, token, zkSyncProvider, tokenSet) {
    const feeInWei = await zkSyncProvider.getTransactionFee(transactionType, address, token) 
    return tokenSet.formatToken(token, fee.totalFee)
} //end getFee()

async function withdrawToEthereum (wallet, amountToWithdraw, withdrawalFee, token, zksync, ethers) {

    const closestPackableAmount  = zksync.utils.closestPackableTransactionAmount(ethers.utils.parseEther(amountToWithdraw))
    const closestPackableFee = zksync.utils.closestPackableTransactionFee(ethers.utils.parseEther(withdrawalFee))
    const withdraw = await wallet.withdrawFromSyncToEthereum({
        ethAddress: wallet.address(),
        token: token,
        amount: closestPackableAmount,
        fee: closestPackableFee
    })
    await withdraw.awaitVerifyReceipt()
  
    console.log('ZKP verification is complete')
  
} //end withdrawToEthereum()

async function displayZkSyncBalance (wallet, tokenSet) {
    const state = await wallet.getAccountState()
    const committedBalances = state.committed.balances
    const verifiedBalances = state.verified.balances

    for (const property in committedBalances) {
        console.log(`Committed ${property} balance for ${wallet.address()}: ${tokenSet.formatToken(property, committedBalances[property])}`)
    } //end for()

    for (const property in verifiedBalances) {
        console.log(`Verified ${property} balance for ${wallet.address()}: ${tokenSet.formatToken(property, verifiedBalances[property])}`)
    } //end for()

    if (state.committed.balances.ETH) {
        console.log(`Commited ETH balance for ${wallet.address()}: ${ethers.utils.formatEther(state.committed.balances.ETH)}`)
    } else {
        console.log(`Commited ETH balance for ${wallet.address()}: 0`)
    }

    if (state.verified.balances.ETH) {
        console.log(`Verified ETH balance for ${wallet.address()}: ${ethers.utils.formatEther(state.verified.balances.ETH)}`)
    } else {
        console.log(`Verified ETH balance for ${wallet.address()}: 0`)
    }
} //end displayZkSyncBalance()

module.exports = {
    getZkSyncProvider,
    getEthereumProvider,
    depositToZkSync,
    registerAccount,
    displayZkSyncBalance,
    transfer,
    withdrawToEthereum,
    getFee,
    initAccount
} //end module.exports()