// 下拉列表
function toggleDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
            adjustDropdownPosition(dropdown,dropdownId);
        }
    }
}

document.querySelectorAll('.des-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        var dropdown = this.querySelector('.dropdown-content');
        if (dropdown) {
            dropdown.style.display = 'block';
            adjustDropdownPosition(dropdown , this.id);
        }
    });

    btn.addEventListener('mouseleave', function() {
        var dropdown = this.querySelector('.dropdown-content');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    });
});

function adjustDropdownPosition(dropdown,dropdownId) {
    if (dropdownId == 'ConnectWallet')
    {
        var trigger = document.getElementById('connectWalletBtn');
        if (trigger) {
            const triggerRect = trigger.getBoundingClientRect();
            dropdown.style.left = `${triggerRect.right - dropdown.offsetWidth}px`;
            dropdown.style.top = `${triggerRect.bottom}px`;

            var rect = dropdown.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                dropdown.style.left = `${window.innerWidth - rect.width}px`;
            }
        }
    }
    else
    {
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';

        var rect = dropdown.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            dropdown.style.left = 'auto';
            dropdown.style.right = '0';
        }
    }
}

function showDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    dropdown.style.display = 'block';
    adjustDropdownPosition(dropdown,dropdownId);
}

function hideDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    dropdown.style.display = 'none';
}

function updateWalletButton() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    const selectedAccount = localStorage.getItem('selectedAccount');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const walletName = localStorage.getItem('walletName');

    const iconWallet = document.querySelector('.icon-wallet img');

    if (walletName) {
        switch (walletName) {
            case 'metamask':
                iconWallet.src = 'images/header/metamask_icon.png';
                break;
            case 'trustwallet':
                iconWallet.src = 'images/header/trustwallet_icon.png';
                break;
            case 'bnbwallet':
                iconWallet.src = 'images/header/binance_icon.png';
                break;
            case 'coinbasewallet':
                iconWallet.src = 'images/header/coinbase_icon.png';
                break;
            case 'mathwallet':
                iconWallet.src = 'images/header/mathwallet_icon.png';
                break;
            default:
                iconWallet.src = 'images/header/wallet_icon.png';
        }
    } else {
        iconWallet.src = 'images/header/wallet_icon.png';
    }

    if (accounts && selectedAccount && connectWalletBtn) {
        // 保留前6位和后4位，中间用3个点表示
        const shortAccount = selectedAccount.substring(0, 6) + '...' + selectedAccount.substring(selectedAccount.length - 4);
        connectWalletBtn.innerText = shortAccount;

        const dropdown = document.getElementById('ConnectWallet');
        dropdown.innerHTML = accounts.map(account => {
            const shortAccountText = account.substring(0, 6) + '...' + account.substring(account.length - 4);
            return `<a href="#" onclick="switchAccount('${account}')">${account === selectedAccount ? `<strong>${shortAccountText}</strong>` : shortAccountText}</a>`;
        }).join('') + '<a href="#" onclick="logout()">Logout</a>';

        connectWalletBtn.removeAttribute('data-translate');
    }else{
        connectWalletBtn.setAttribute('data-translate', 'connect_wallet');
    }
}


function switchAccount(account) {
    const selectedAccount = localStorage.getItem('selectedAccount');
    if (account !== selectedAccount) {
        localStorage.setItem('selectedAccount', account);
        updateWalletButton();
        // location.reload();
    }
}

function handleWalletButtonMouseEnter() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    if (!accounts || accounts.length === 0) {
        connectWalletOptions();
    }else{
        updateWalletButton();
    }
    showDropdown('ConnectWallet');
}

function handleWalletButtonClick() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    if (!accounts || accounts.length === 0) {
        // connectWallet();
        // document.dispatchEvent(new Event('connectWallet'));
        const connectWalletDropdown = document.getElementById('ConnectWallet');
        connectWalletDropdown.style.display = 'block';
    } else {
        // document.getElementById('confirmLogout').style.display = 'flex';
    }
}

function connectWalletOptions() {
    const connectWalletDropdown = document.getElementById('ConnectWallet');
    const walletOptions = [
        { name: 'Metamask', icon: 'images/header/metamask_Icon.png', walletName: 'metamask' },
        { name: 'Trust Wallet', icon: 'images/header/trustwallet_Icon.png', walletName: 'trustwallet' },
        { name: 'Coinbase Wallet', icon: 'images/header/coinbase_Icon.png', walletName: 'coinbasewallet' },
        { name: 'Safe Pal Wallet', icon: 'images/header/safepal_Icon.png', walletName: 'safepalwallet' },
        { name: 'Binance Web3 Wallet', icon: 'images/header/binance_Icon.png', walletName: 'bnbwallet' }
    ];

    connectWalletDropdown.innerHTML = '<div class="wallet-options-grid">' + walletOptions.map(option => `
        <div class="wallet-option" onclick="connectWeb3Wallet('${option.walletName}')">
            <img src="${option.icon}" alt="${option.name}">
            <span>${option.name}</span>
        </div>
    `).join('') + '</div>';
}

function connectWeb3Wallet(walletName) {
    localStorage.setItem('walletName', walletName);
    // console.log("connectWeb3Wallet - walletName = ",walletName);
    document.dispatchEvent(new Event('connectWallet'));
}

function logout() {
    localStorage.removeItem('walletName');
    localStorage.removeItem('walletAccounts');
    localStorage.removeItem('selectedAccount');
    updateWalletButton(); // 更新按钮状态
    setLogoutWalletStage();
    location.reload();
}

function closeLogoutModal() {
    document.getElementById('confirmLogout').style.display = 'none';
}

// 飘字
function showFloatingText(message) {
    const floatingText = document.getElementById('floatingText');
    floatingText.textContent = message;
    floatingText.style.display = 'block';

    setTimeout(() => {
        floatingText.style.display = 'none';
    }, 3000); // 3 seconds
}
