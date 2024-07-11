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
            adjustDropdownPosition(dropdown);
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

// 连接钱包函数
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 请求账户访问权限
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
                params: [{ eth_accounts: {} }]
            });

            // 保存账号信息到 LocalStorage
            localStorage.setItem('walletAccounts', JSON.stringify(accounts));
            localStorage.setItem('selectedAccount', accounts[0]);

            updateWalletButton();
            showFloatingText('Wallet account is already logged in');
        } catch (error) {
            console.error("User rejected the request or there was an error");
            alert('Failed to connect wallet. Please ensure MetaMask is unlocked and try again.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
    }
}

function updateWalletButton() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    const selectedAccount = localStorage.getItem('selectedAccount');
    const connectWalletBtn = document.getElementById('connectWalletBtn');

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
        location.reload();
    }
}

function handleWalletButtonMouseEnter() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    if (accounts && accounts.length > 0) {
        showDropdown('ConnectWallet');
    }
}

function handleWalletButtonClick() {
    const accounts = JSON.parse(localStorage.getItem('walletAccounts'));
    if (!accounts || accounts.length === 0) {
        connectWallet();
    } else {
        document.getElementById('confirmLogout').style.display = 'flex';
    }
}

function logout() {
    localStorage.removeItem('walletAccounts');
    localStorage.removeItem('selectedAccount');
    updateWalletButton(); // 更新按钮状态
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
