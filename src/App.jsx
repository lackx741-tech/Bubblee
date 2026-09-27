import React from 'react'
import { useAccount, useDisconnect, useChainId } from 'wagmi'

export default function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()

  return (
    <div className="page">
      <div className="card">
        <h1>Connect Your Wallet</h1>
        <p className="sub">Official Reown AppKit modal (exact UI family)</p>

        {/* Official button that opens the exact modal */}
        <appkit-button />

        {isConnected && (
          <div className="info">
            <div>
              <span>Address:</span>
              <strong>{address}</strong>
            </div>
            <div>
              <span>Chain ID:</span>
              <strong>{chainId}</strong>
            </div>
            <button onClick={() => disconnect()} className="disconnect">
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
