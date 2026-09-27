# Wallet Connect App (Plain HTML/CSS/JS)

A fully editable wallet connect UI (like the WalletConnect / Web3Modal "Connect Wallet" popup),
built with **plain HTML, CSS, and JavaScript** — no TypeScript, no build tools, no npm install needed.

## How to run

1. Download/clone this repo.
2. Open `index.html` directly in your browser (double-click it), **or** serve it locally:
   ```bash
   npx serve .
   ```
3. Click "Connect Wallet" to see the modal.

## How to set it up

1. Get a free WalletConnect Project ID at https://cloud.reown.com
2. Open `app.js` and replace:
   ```javascript
   const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID_HERE';
   ```
   with your real project ID.
3. That's it — MetaMask/injected wallets work immediately with no extra setup.

## How to customize

- **Colors & layout** → edit `style.css`
- **Which wallets appear, icons, labels, tags** → edit the `WALLET_CONFIG` array at the top of `app.js`
- **Text/copy** → edit `index.html`

## Files

- `index.html` — page structure and modal markup
- `style.css` — all styling (dark theme, matches the WalletConnect look)
- `app.js` — all logic: rendering wallet list, connecting via MetaMask/injected wallets or WalletConnect QR, disconnect handling

No React, no TypeScript, no bundler — just open and edit.
