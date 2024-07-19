async function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}

// 连接钱包函数
let connectStage = false;
async function connectWallet() {
    // console.log(' connectWallet!!! ');
    const walletName = localStorage.getItem('walletName');
    // const walletName = 'metamask';
    if (walletName === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // 请求账户访问权限
                web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                    params: [{ eth_accounts: {} }]
                });
                // 保存账号信息到 LocalStorage
                localStorage.setItem('walletAccounts', JSON.stringify(accounts));
                localStorage.setItem('selectedAccount', accounts[0]);

                connectStage = true;
                document.dispatchEvent(new Event('connectWalletDone'));

            } catch (error) {
                console.error("User rejected the request or there was an error");
                alert('Failed to connect wallet. Please ensure MetaMask is unlocked and try again.');
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    } else if (walletName === 'trustwallet') {
        try {
            const trustWalletFile = 'web3/js/wallet/trustWallet.js';
            await loadScript(trustWalletFile);

            web3 = new Web3(window.trustwallet);
            const injectedProvider = await getTrustWalletInjectedProvider();
            const accounts = await injectedProvider.request({
                method: "eth_requestAccounts",
            });
            localStorage.setItem('walletAccounts', JSON.stringify(accounts));
            localStorage.setItem('selectedAccount', accounts[0]);

            connectStage = true;
            await document.dispatchEvent(new Event('connectWalletDone'));            

        } catch (error) {
            console.error("User rejected the request or there was an error");
            alert('Failed to connect wallet. Please ensure Trust Wallet is unlocked and try again.');
        }
     } else if (walletName === 'bnbwallet') {
        try {
            web3 = new Web3(window.BinanceChain);
            const accounts = await window.BinanceChain.request({ method: 'eth_requestAccounts' });

            localStorage.setItem('walletAccounts', JSON.stringify(accounts));
            localStorage.setItem('selectedAccount', accounts[0]);

            connectStage = true;
            await document.dispatchEvent(new Event('connectWalletDone'));

        } catch (error) {
            reject(error);
        }
    } else if (walletName === 'coinbasewallet') {
        try {
            web3 = new Web3(window.coinbaseWalletExtension);
            const accounts = await window.coinbaseWalletExtension.request({ method: 'eth_requestAccounts' });

            localStorage.setItem('walletAccounts', JSON.stringify(accounts));
            localStorage.setItem('selectedAccount', accounts[0]);

            connectStage = true;
            await document.dispatchEvent(new Event('connectWalletDone'));

        } catch (error) {
            reject(error);
        }
    } else if (walletName === 'safepalwallet') {
        try {
            web3 = new Web3(window.safepalProvider);
            const accounts = await window.safepalProvider.request({ method: 'eth_requestAccounts' });

            localStorage.setItem('walletAccounts', JSON.stringify(accounts));
            localStorage.setItem('selectedAccount', accounts[0]);

            connectStage = true;
            await document.dispatchEvent(new Event('connectWalletDone'));

        } catch (error) {
            reject(error);
        }
    } else {
        alert('Unsupported wallet. Please select MetaMask or Trust Wallet.');
    }
}

function checkInitWeb3(){
    if (!connectStage) {
        return false;
    }
    return true;
}

function setLogoutWalletStage(){
    connectStage = false;
}

async function switchToBSC() {
    const walletName = localStorage.getItem('walletName');
    // const walletName = 'metamask';
    if (walletName === 'metamask') {
        try {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    }],
                });
                console.log('Network switched to BSC Testnet');
            } else {
                console.log('MetaMask is not installed');
            }
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    } else if (walletName === 'trustwallet') {
        const injectedProvider = await getTrustWalletInjectedProvider();
        try {
            if (injectedProvider) {
                await injectedProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    }],
                });
            } else {
                console.log('trustwallet is not installed');
            }
        } catch (error) {
            console.error("User rejected the request or there was an error");
            alert('Failed to connect wallet. Please ensure Trust Wallet is unlocked and try again.');
        }
    } else if (walletName === 'bnbwallet') {
        try {
            if (window.BinanceChain) {
                await window.BinanceChain.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    }],
                });
                console.log('Network switched to BSC Testnet');
            } else {
                console.log('MetaMask is not installed');
            }
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    } else if (walletName === 'coinbasewallet') {
        try {
            if (window.coinbaseWalletExtension) {
                await window.coinbaseWalletExtension.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    }],
                });
                console.log('Network switched to BSC Testnet');
            } else {
                console.log('MetaMask is not installed');
            }
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    } else if (walletName === 'safepalwallet') {
        try {
            if (window.safepalProvider) {
                await window.safepalProvider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    }],
                });
                console.log('Network switched to BSC Testnet');
            } else {
                console.log('MetaMask is not installed');
            }
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    } else {
        alert('Unsupported wallet. Please select MetaMask or Trust Wallet.');
    }
}

async function addTestToken() {
    const walletName = localStorage.getItem('walletName');
    // console.log('walletName = ',walletName);
    // const walletName = 'metamask';
    try {
        if (walletName === 'metamask') {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: '0x92f648689ec1187c20619951eea24c8f5752ebf4',
                            symbol: 'MCFTS',
                            decimals: 18,
                            image: 'https://meizibiepao.github.io/my-website/images/tokenIcon/CatEarCoin.png',
                        },
                    },
                });
                console.log('Test token added for MetaMask');
            } else {
                console.log('MetaMask is not installed');
            }
        } else if (walletName === 'trustwallet') {
            alert('Trust Wallet needs to manually add tokens \n\ntype:ERC20\naddress:0x92f648689ec1187c20619951eea24c8f5752ebf4\nymbol:MCFTS\ndecimals:18');
        } else if (walletName === 'bnbwallet') {
            alert('BNB Chain Wallet needs to manually add tokens \n\ntype:ERC20\naddress:0x92f648689ec1187c20619951eea24c8f5752ebf4\nymbol:MCFTS\ndecimals:18');
        } else if (walletName === 'coinbasewallet') {
            if (window.coinbaseWalletExtension) {
                await window.coinbaseWalletExtension.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: '0x92f648689ec1187c20619951eea24c8f5752ebf4',
                            symbol: 'MCFTS',
                            decimals: 18,
                            image: 'https://meizibiepao.github.io/my-website/images/tokenIcon/CatEarCoin.png',
                        },
                    },
                });
                console.log('Test token added for MetaMask');
            } else {
                console.log('MetaMask is not installed');
            }
        } else if (walletName === 'safepalwallet') {
            if (window.safepalProvider) {
                await window.safepalProvider.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: '0x92f648689ec1187c20619951eea24c8f5752ebf4',
                            symbol: 'MCFTS',
                            decimals: 18,
                            image: 'https://meizibiepao.github.io/my-website/images/tokenIcon/CatEarCoin.png',
                        },
                    },
                });
                console.log('Test token added for MetaMask');
            } else {
                console.log('MetaMask is not installed');
            }
        } else {
            alert('Unsupported wallet. Please select MetaMask or Trust Wallet.');
        }
    } catch (error) {
        console.error('Failed to add test token:', error);
    }
}


// 加载 web3 并初始化
function loadWeb3(callback) {
    const script = document.createElement('script');
    script.src = "web3/libs/web3.min.js";
    script.onload = callback;
    document.head.appendChild(script);
}

loadWeb3(async () => {
    // await initializeWeb3();
    // await initializeContracts();
});
