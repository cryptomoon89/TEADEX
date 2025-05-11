"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@/components/connect-button"
import { SwapInterface } from "@/components/swap-interface"
import { LiquidityInterface } from "@/components/liquidity-interface"
import { TokensTable } from "@/components/tokens-table"
import { TransactionHistory } from "@/components/transaction-history"
import { TeaMascot } from "@/components/tea-mascot"
import { NetworkStats } from "@/components/network-stats"
import { TeadexLogo } from "@/components/teadex-logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { SUPPORTED_CHAINS } from "@/constants/chains"
import { useWeb3 } from "@/providers/web3-provider"

export default function Home() {
  const { address, isConnected, chainId, switchChain } = useWeb3()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const { toast } = useToast()

  // Tea-Sepolia testnet chain ID
  const teaSepoliaChainId = SUPPORTED_CHAINS[0].id

  useEffect(() => {
    if (chainId === teaSepoliaChainId) {
      setIsCorrectNetwork(true)
    } else {
      setIsCorrectNetwork(false)
    }
  }, [chainId, teaSepoliaChainId])

  const handleSwitchNetwork = () => {
    try {
      switchChain({ chainId: teaSepoliaChainId })
      toast({
        title: "Network Switch Initiated",
        description: "Please approve the network switch in your wallet.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Switch Failed",
        description: "Failed to switch network. Please try again.",
      })
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-gradient-to-b from-[#f0fff4] via-[#e6ffec] to-[#ddffd8] dark:from-[#0a291b] dark:via-[#0c2c1e] dark:to-[#0e3323]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="b" gradientTransform="rotate(45 .5 .5)">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <clipPath id="a">
                <path
                  fill="currentColor"
                  d="M761.5 656.5Q679 813 522.5 777T280 627.5Q194 514 285 389T481 179.5Q586 95 696 179.5t169 230Q924 500 761.5 656.5Z"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#a)">
              <path
                fill="url(#b)"
                d="M761.5 656.5Q679 813 522.5 777T280 627.5Q194 514 285 389T481 179.5Q586 95 696 179.5t169 230Q924 500 761.5 656.5Z"
              />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-10 dark:opacity-20">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="d" gradientTransform="rotate(45 .5 .5)">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <clipPath id="c">
                <path fill="currentColor" d="M579.5 793Q368 1086 184 843T247.5 357.5Q495 115 673 311.5T579.5 793Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#c)">
              <path fill="url(#d)" d="M579.5 793Q368 1086 184 843T247.5 357.5Q495 115 673 311.5T579.5 793Z" />
            </g>
          </svg>
        </div>
      </div>

      {/* Tea Mascot */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-80 md:h-80 opacity-70 pointer-events-none">
        <TeaMascot />
      </div>

      <header className="w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TeadexLogo size="md" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                TEADEX
              </h1>
              <p className="text-xs text-muted-foreground">The sweetest DEX on testnet</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1 z-10">
        {isConnected && !isCorrectNetwork && (
          <Alert variant="destructive" className="mb-6 animate-fadeIn">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wrong Network</AlertTitle>
            <AlertDescription className="flex items-center">
              Please switch to the Tea-Sepolia testnet to use TEADEX.
              <Button variant="outline" size="sm" onClick={handleSwitchNetwork} className="ml-2">
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="w-full overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
                <CardTitle className="text-2xl font-bold">TEADEX</CardTitle>
                <CardDescription>Swap tokens and provide liquidity on the Tea-Sepolia testnet</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="swap" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger
                      value="swap"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      Swap
                    </TabsTrigger>
                    <TabsTrigger
                      value="liquidity"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      Liquidity
                    </TabsTrigger>
                    <TabsTrigger
                      value="tokens"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      Tokens
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="swap" className="animate-fadeIn">
                    <SwapInterface />
                  </TabsContent>
                  <TabsContent value="liquidity" className="animate-fadeIn">
                    <LiquidityInterface />
                  </TabsContent>
                  <TabsContent value="tokens" className="animate-fadeIn">
                    <TokensTable />
                  </TabsContent>
                  <TabsContent value="history" className="animate-fadeIn">
                    <TransactionHistory />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <NetworkStats />
          </div>

          <div className="lg:col-span-1">
            <Card className="w-full h-full border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Latest prices and market data</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {SUPPORTED_CHAINS[0].tokens.map((token) => (
                    <div
                      key={token.address}
                      className="flex justify-between items-center p-4 border rounded-lg transition-all hover:shadow-md hover:border-green-200 dark:hover:border-green-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                          <span className="font-bold text-xs">{token.symbol.substring(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${token.price?.toFixed(2) || "0.00"}</p>
                        <p className={`text-xs ${token.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {token.priceChange >= 0 ? "+" : ""}
                          {token.priceChange?.toFixed(2) || "0.00"}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-8 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TeadexLogo size="sm" />
              <p className="text-sm text-muted-foreground">© 2025 TEADEX. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </main>
  )
}
