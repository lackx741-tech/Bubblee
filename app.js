// ============================================================
// Wallet Connect App - plain JavaScript, no build tools, no TS
// Edit WALLET_CONFIG below to change which wallets show up,
// their icons, colors, and labels.
// ============================================================

// 1) SET YOUR WALLETCONNECT PROJECT ID HERE
//    Get a free one at https://cloud.reown.com (formerly cloud.walletconnect.com)
const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID_HERE';

// 2) Edit this list to control which wallets appear in the modal.
//    type: 'injected' checks window.ethereum (MetaMask, etc.)
//    type: 'walletconnect' opens the WalletConnect QR flow.
//    type: 'link' just opens a URL (useful for wallets you don't code against yet).
const WALLET_CONFIG = [
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    type: 'walletconnect',
    tag: 'QR CODE',
    tagClass: 'tag-qrcode',
    color: '#3b82f6',
    letter: 'W'
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    type: 'injected',
    providerFlag: 'isMetaMask',
    tag: 'INSTALLED',
    tagClass: 'tag-installed',
    color: '#f97316',
    letter: 'M'
  },
  {
    id: 'safepal',
    name: 'SafePal',
    type: 'injected',
    providerFlag: 'isSafePal',
    tag: 'INSTALLED',
    tagClass: 'tag-installed',
    color: '#7c3aed',
    letter: 'S'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    type: 'injected',
    providerFlag: 'isCoinbaseWallet',
    tag: 'INSTALLED',
    tagClass: 'tag-installed',
    color: '#2563eb',
    letter: 'C'
  }
];

// ------------------------------------------------------------
// App state
// ------------------------------------------------------------
let ethersProvider = null;
let signer = null;
let currentAddress = null;
let wcProvider = null; // WalletConnect provider instance

// ------------------------------------------------------------
// DOM references
// ------------------------------------------------------------
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const walletList = document.getElementById('walletList');
const walletInfo = document.getElementById('walletInfo');
const walletAddressEl = document.getElementById('walletAddress');
const walletNetworkEl = document.getElementById('walletNetwork');
const disconnectBtn = document.getElementById('disconnectBtn');

// ------------------------------------------------------------
// Build the wallet list UI from WALLET_CONFIG
// ------------------------------------------------------------
function renderWalletList() {
  walletList.innerHTML = '';

  WALLET_CONFIG.forEach((wallet) => {
    const installed = wallet.type === 'injected' ? isWalletInstalled(wallet) : true;

    const row = document.createElement('div');
    row.className = 'wallet-option';
    row.innerHTML = `
      <div class="wallet-left">
        <div class="wallet-icon" style="background:${wallet.color}">${wallet.letter}</div>
        <div class="wallet-name">${wallet.name}</div>
      </div>
      <div class="wallet-tag ${wallet.tagClass}">${installed || wallet.type === 'walletconnect' ? wallet.tag : 'NOT INSTALLED'}</div>
    `;

    row.addEventListener('click', () => handleWalletClick(wallet));
    walletList.appendChild(row);
  });
}

function isWalletInstalled(wallet) {
  if (typeof window.ethereum === 'undefined') return false;
  if (!wallet.providerFlag) return true;

  // Some browsers inject multiple providers into window.ethereum.providers
  const providers = window.ethereum.providers || [window.ethereum];
  return providers.some((p) => p[wallet.providerFlag]);
}

function getInjectedProvider(wallet) {
  const providers = window.ethereum.providers || [window.ethereum];
  if (!wallet.providerFlag) return window.ethereum;
  return providers.find((p) => p[wallet.providerFlag]) || window.ethereum;
}

// ------------------------------------------------------------
// Modal open/close
// ------------------------------------------------------------
openModalBtn.addEventListener('click', () => {
  renderWalletList();
  modalOverlay.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
});

// ------------------------------------------------------------
// Handle wallet selection
// ------------------------------------------------------------
async function handleWalletClick(wallet) {
  try {
    if (wallet.type === 'injected') {
      if (!isWalletInstalled(wallet)) {
        alert(`${wallet.name} is not installed in this browser.`);
        return;
      }
      await connectInjected(wallet);
    } else if (wallet.type === 'walletconnect') {
      await connectWalletConnect();
    }
    modalOverlay.classList.add('hidden');
  } catch (err) {
    console.error(err);
    alert('Connection failed: ' + (err.message || err));
  }
}

// ------------------------------------------------------------
// Connect via injected provider (MetaMask, SafePal, etc.)
// ------------------------------------------------------------
async function connectInjected(wallet) {
  const injected = getInjectedProvider(wallet);
  ethersProvider = new ethers.BrowserProvider(injected);

  await injected.request({ method: 'eth_requestAccounts' });

  signer = await ethersProvider.getSigner();
  currentAddress = await signer.getAddress();

  const network = await ethersProvider.getNetwork();
  updateWalletUI(currentAddress, network.name);

  injected.on && injected.on('accountsChanged', handleAccountsChanged);
  injected.on && injected.on('chainChanged', () => window.location.reload());
}

// ------------------------------------------------------------
// Connect via WalletConnect (QR code flow)
// ------------------------------------------------------------
async function connectWalletConnect() {
  if (WALLETCONNECT_PROJECT_ID === 'YOUR_PROJECT_ID_HERE') {
    alert('Set your WALLETCONNECT_PROJECT_ID in app.js first (free at cloud.reown.com)');
    return;
  }

  const EthereumProviderLib = window.EthereumProvider || (window.WalletConnectEthereumProvider);

  wcProvider = await EthereumProviderLib.init({
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [1],
    optionalChains: [1, 42161, 137],
    showQrModal: true
  });

  await wcProvider.enable();

  ethersProvider = new ethers.BrowserProvider(wcProvider);
  signer = await ethersProvider.getSigner();
  currentAddress = await signer.getAddress();

  const network = await ethersProvider.getNetwork();
  updateWalletUI(currentAddress, network.name);

  wcProvider.on('accountsChanged', handleAccountsChanged);
  wcProvider.on('chainChanged', () => window.location.reload());
  wcProvider.on('disconnect', doDisconnect);
}

// ------------------------------------------------------------
// UI updates
// ------------------------------------------------------------
function updateWalletUI(address, networkName) {
  walletAddressEl.textContent = shortenAddress(address);
  walletNetworkEl.textContent = networkName || 'Unknown';
  walletInfo.classList.remove('hidden');
  openModalBtn.classList.add('hidden');
}

function shortenAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

function handleAccountsChanged(accounts) {
  if (!accounts || accounts.length === 0) {
    doDisconnect();
  } else {
    currentAddress = accounts[0];
    walletAddressEl.textContent = shortenAddress(currentAddress);
  }
}

// ------------------------------------------------------------
// Disconnect
// ------------------------------------------------------------
disconnectBtn.addEventListener('click', doDisconnect);

async function doDisconnect() {
  try {
    if (wcProvider && wcProvider.disconnect) {
      await wcProvider.disconnect();
    }
  } catch (e) {
    console.warn(e);
  }

  ethersProvider = null;
  signer = null;
  currentAddress = null;
  wcProvider = null;

  walletInfo.classList.add('hidden');
  openModalBtn.classList.remove('hidden');
}
