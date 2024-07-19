// contactFunctions.js

var web3;
var tokenContract;
var stakingContract;
var airdropContract;
var gameExchangeContract;
var tokenClaimContract;
var tokenOwner; // 全局变量
var tokenAddress;
var tokenABI;
var stakingContractAddress; // 全局变量
var stakingContractABI;
var airdropContractAddress;
var airdropContractABI;
var gameExchangeContractAddress;
var gameExchangeContractABI;
var tokenClaimContractAddress;
var tokenClaimContractABI;

// // 加载 web3 并初始化
// function loadWeb3(callback) {
//     const script = document.createElement('script');
//     script.src = "web3/libs/web3.min.js";
//     script.onload = callback;
//     document.head.appendChild(script);
// }

async function initializeContracts() {
    const response = await fetch('config/config.json');
    const config = await response.json();

    tokenOwner = config.tokenOwner;

    tokenAddress = config.tokenAddress;
    tokenABI = config.tokenABI;
    stakingContractAddress = config.stakingContractAddress;
    stakingContractABI = config.stakingContractABI;
    airdropContractAddress = config.airdropContractAddress;
    airdropContractABI = config.airdropContractABI;
    gameExchangeContractAddress = config.gameExchangeContractAddress;
    gameExchangeContractABI = config.gameExchangeContractABI;

    tokenClaimContractAddress = config.tokenClaimContractAddress;
    tokenClaimContractABI = config.tokenClaimContractABI;

    tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
    stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);
    airdropContract = new web3.eth.Contract(airdropContractABI, airdropContractAddress);
    gameExchangeContract = new web3.eth.Contract(gameExchangeContractABI, gameExchangeContractAddress);
    tokenClaimContract = new web3.eth.Contract(tokenClaimContractABI, tokenClaimContractAddress);
}

// 新增获取变量的函数
function getContractVariable(variableName) {
    switch(variableName) {
        case 'tokenOwner':
            return tokenOwner;
        case 'stakingContractAddress':
            return stakingContractAddress;
        case 'airdropContractAddress':
            return airdropContractAddress;
        case 'gameExchangeContractAddress':
            return gameExchangeContractAddress;
        case 'tokenClaimContractAddress':
            return tokenClaimContractAddress;

        default:
            return null;
    }
}

// 通用合约调用函数
async function callContract(contractName, methodName, params, fromAddress, value) {
    const contractMapping = {
        'Token': { address: tokenAddress, abi: tokenABI },
        'Staking': { address: stakingContractAddress, abi: stakingContractABI },
        'Airdrop': { address: airdropContractAddress, abi: airdropContractABI },
        'GameExchange': { address: gameExchangeContractAddress, abi: gameExchangeContractABI },
        'TokenClaim': { address: tokenClaimContractAddress, abi: tokenClaimContractABI }
    };

    const contractInfo = contractMapping[contractName];
    if (!contractInfo) {
        console.error('Contract not found');
        return;
    }

    const contractInstance = new web3.eth.Contract(contractInfo.abi, contractInfo.address);
    const method = contractInstance.methods[methodName](...params.map(param => typeof param === 'bigint' ? param.toString() : param));
    try {
        const response = await method.send({ from: fromAddress, value: web3.utils.toWei(value, 'ether') });
        console.log(`${methodName} executed successfully`, response);
    } catch (error) {
        console.error(`${methodName} failed`, error);
    }
}

// 以下为原来的函数，移至此处

async function stake(amount, account) {
    await callContract('Staking', 'stake', [web3.utils.toWei(amount, 'ether')], account, '0');
}

// 查询质押信息函数
async function getStakeInfo(address) {
    try { 
        const stakedBalance = await stakingContract.methods.stakedBalance(address).call();
        const stakedAmountBigInt = BigInt(stakedBalance.stakedAmount);
        const stakedAmount = web3.utils.fromWei(stakedAmountBigInt.toString(), 'ether');
        
        const lockEndTimeBigInt = BigInt(stakedBalance.lockEndTime);
        const lockEndTime = new Date(Number(lockEndTimeBigInt) * 1000).toLocaleString();
        
        return `Staked Amount: ${stakedAmount} CEC, Lock End Time: ${lockEndTime}`;
    } catch (error) {
        console.error('Failed to fetch stake info:', error);
        throw new Error('Error while fetching staking info');
    }
}

// 查询质押奖励函数
async function getRewardInfo(address) {
    try {
        const rewardBalance = await stakingContract.methods.rewardBalance(address).call();
        const rewardAmount = web3.utils.fromWei(rewardBalance, 'ether');
        return `Reward Amount: ${rewardAmount} CEC`;
    } catch (error) {
        console.error('Failed to fetch reward info:', error);
        throw new Error('Error while fetching reward info');
    }
}

async function withdraw(amount, account) {
    await callContract('Staking', 'withdraw', [web3.utils.toWei(amount, 'ether')], account, '0');
}

async function claimRewards(account) {
    await callContract('Staking', 'getReward', [], account, '0');
}

// 查询空投信息函数
async function getAirdropInfo(address) {
    try {
        const airdropInfo = await airdropContract.methods.getAirdropInfo(address).call();
        const isRegistered = airdropInfo[0];

        if (!isRegistered) {
            return 'This address is not registered.';
        }

        const registrationTime = new Date(Number(airdropInfo[1]) * 1000).toLocaleString();
        const claimableAmount = web3.utils.fromWei(airdropInfo[2].toString(), 'ether');
        const deadlines = airdropInfo[3].map(deadline => new Date(Number(deadline) * 1000).toLocaleString());
        const amounts = airdropInfo[4].map(amount => web3.utils.fromWei(amount.toString(), 'ether'));

        const firstStageDeadline = deadlines[0];
        const secondStageDeadline = deadlines[1];
        const thirdStageDeadline = deadlines[2];
        const firstStageAmount = amounts[0];
        const secondStageAmount = amounts[1];
        const thirdStageAmount = amounts[2];

        return `Registration Time: ${registrationTime}, Claimable Amount: ${claimableAmount} CEC\nFirst Stage Reward: ${firstStageAmount} CEC (Within 30 days, Deadline: ${firstStageDeadline})\nSecond Stage Reward: ${secondStageAmount} CEC (31-90 days, Deadline: ${secondStageDeadline})\nThird Stage Reward: ${thirdStageAmount} CEC (After 90 days, Deadline: ${thirdStageDeadline})`;
    } catch (error) {
        console.error('Failed to fetch airdrop info:', error);
        throw new Error('Error while fetching airdrop info');
    }
}


async function registerForAirdrop(account) {
    await callContract('Airdrop', 'register', [], account, '0');
}

async function claimAirdrop(account) {
    await callContract('Airdrop', 'claimAirdrop', [], account, '0');
}

async function exchangeItemForTokens(amount, account) {
    await callContract('GameExchange', 'exchangeItemForTokens', [web3.utils.toWei(amount, 'ether')], account, '0');
}

async function exchangeTokensForItem(amount, account) {
    await callContract('GameExchange', 'exchangeTokensForItem', [web3.utils.toWei(amount, 'ether')], account, '0');
}

async function getBNB() {
    const url = 'https://testnet.binance.org/faucet-smart/api';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // 添加请求体，根据API文档的要求填写
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Failed to fetch BNB:', error);
    }
}

async function getCEC(recipient, account) {
    await callContract('TokenClaim', 'claimTokens', [recipient], account, '0');
}

async function transfer(to, amount, account) {
    await callContract('Token', 'transfer', [to, web3.utils.toWei(amount, 'ether')], account, '0');
}

async function approve(spender, amount, account) {
    await callContract('Token', 'approve', [spender, web3.utils.toWei(amount, 'ether')], account, '0');
}

async function transferFrom(from, to, amount, account) {
    await callContract('Token', 'transferFrom', [from, to, web3.utils.toWei(amount, 'ether')], account, '0');
}

// 查询授权数量函数
async function getAllowance(owner, spender) {
    try {
        const allowance = await tokenContract.methods.allowance(owner, spender).call();
        const allowanceAmount = web3.utils.fromWei(allowance, 'ether');
        return `Allowance: ${allowanceAmount} CEC`;
    } catch (error) {
        console.error('Failed to fetch allowance:', error);
        throw new Error('Error while fetching allowance');
    }
}


function loadWeb3(callback) {
    const script = document.createElement('script');
    script.src = "web3/libs/web3.min.js";
    script.onload = callback;
    document.head.appendChild(script);
}

// // 加载 web3 并初始化
// loadWeb3(async () => {
//     // await initializeWeb3();
//     await initializeContracts();
// });