import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon, base } from '@reown/appkit/networks'
import App from './App'
import './styles.css'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('Missing VITE_REOWN_PROJECT_ID. Add it in .env file.')
}

const networks = [mainnet, arbitrum, polygon, base]

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

const wagmiConfig = wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata: {
    name: 'Bubblee',
    description: 'Official Reown AppKit wallet connection',
    url: 'http://localhost:5173',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: true,
    email: true,
    socials: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#3b82f6',
    '--w3m-border-radius-master': '16px'
  }
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
