"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

// Define the Tea-Sepolia testnet
const teaSepolia = {
  id: 11155111,
  name: "Tea-Sepolia",
  network: "tea-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "SEP",
  },
  rpcUrls: {
    public: { http: ["https://rpc.sepolia.org"] },
    default: { http: ["https://rpc.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
}

// Create a mock web3 context to simulate wallet connection
type Web3ContextType = {
  address: string | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  chainId: number
  switchChain: (params: { chainId: number }) => void
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  chainId: teaSepolia.id,
  switchChain: () => {},
})

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState(teaSepolia.id)

  // Simulate connection on mount
  useEffect(() => {
    // Check if we have a stored connection
    const storedAddress = localStorage.getItem("dex-connected-address")
    if (storedAddress) {
      setAddress(storedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = () => {
    // Simulate wallet connection
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    setAddress(mockAddress)
    setIsConnected(true)
    localStorage.setItem("dex-connected-address", mockAddress)
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("dex-connected-address")
  }

  const switchChain = (params: { chainId: number }) => {
    setChainId(params.chainId)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Context.Provider
        value={{
          address,
          isConnected,
          connect,
          disconnect,
          chainId,
          switchChain,
        }}
      >
        {children}
      </Web3Context.Provider>
    </QueryClientProvider>
  )
}
