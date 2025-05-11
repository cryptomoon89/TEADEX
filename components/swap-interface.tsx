"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, RefreshCw, Settings, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { SUPPORTED_CHAINS } from "@/constants/chains"
import { calculateAmountOut } from "@/lib/swap-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { useWeb3 } from "@/providers/web3-provider"

export function SwapInterface() {
  const { address, isConnected } = useWeb3()
  const { toast } = useToast()
  const [fromToken, setFromToken] = useState(SUPPORTED_CHAINS[0].tokens[0])
  const [toToken, setToToken] = useState(SUPPORTED_CHAINS[0].tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fromTokenBalance, setFromTokenBalance] = useState("10.0000")
  const [toTokenBalance, setToTokenBalance] = useState("1000.0000")

  useEffect(() => {
    // Simulate fetching balances
    if (address) {
      setFromTokenBalance(Math.random() * 20 + 5).toFixed(4)
      setToTokenBalance(Math.random() * 2000 + 500).toFixed(4)
    }
  }, [address, fromToken, toToken])

  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0) {
      calculateOutputAmount(fromAmount)
    } else {
      setToAmount("")
      setPriceImpact(null)
    }
  }, [fromAmount, fromToken, toToken])

  const calculateOutputAmount = async (amount: string) => {
    try {
      if (!amount || Number(amount) <= 0) return

      // In a real app, this would call the router's getAmountsOut function
      const result = await calculateAmountOut(fromToken, toToken, amount)
      setToAmount(result.amountOut)
      setPriceImpact(result.priceImpact)
    } catch (error) {
      console.error("Error calculating output amount:", error)
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Failed to calculate swap amount. Please try again.",
      })
    }
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
    }
  }

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value)
      // Reverse calculation would be implemented here
    }
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleMaxClick = () => {
    if (fromTokenBalance) {
      // Leave a small amount for gas if the token is native
      if (fromToken.address === "native") {
        const balance = Number(fromTokenBalance)
        const maxAmount = Math.max(balance - 0.01, 0).toString()
        setFromAmount(maxAmount)
      } else {
        setFromAmount(fromTokenBalance)
      }
    }
  }

  const handleSlippageChange = (value: number[]) => {
    setSlippage(value[0])
  }

  const handleSwap = async () => {
    if (!address || !fromAmount || Number(fromAmount) <= 0) return

    setShowConfirmation(false)
    setIsLoading(true)

    try {
      // Simulate transaction
      setTimeout(() => {
        toast({
          title: "Swap Successful",
          description: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
        })
        setFromAmount("")
        setToAmount("")
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: "There was an error processing your swap. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const confirmSwap = () => {
    setShowConfirmation(true)
  }

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Swap Tokens</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex justify-between mb-2">
                <Label htmlFor="fromAmount" className="text-sm font-medium">
                  From
                </Label>
                <span className="text-sm text-muted-foreground">
                  Balance: {fromTokenBalance} {fromToken.symbol}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="fromAmount"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.0"
                    className="pr-16 h-14 text-lg font-medium border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                    onClick={handleMaxClick}
                  >
                    MAX
                  </Button>
                </div>
                <Select
                  value={fromToken.address}
                  onValueChange={(value) =>
                    setFromToken(
                      SUPPORTED_CHAINS[0].tokens.find((t) => t.address === value) || SUPPORTED_CHAINS[0].tokens[0],
                    )
                  }
                >
                  <SelectTrigger className="w-[140px] h-14 border-0 bg-transparent focus:ring-0">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CHAINS[0].tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-2">
                            <span className="text-xs">{token.symbol.substring(0, 2)}</span>
                          </div>
                          {token.symbol}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapTokens}
                className="rounded-full h-10 w-10 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
              >
                <ArrowDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              </Button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex justify-between mb-2">
                <Label htmlFor="toAmount" className="text-sm font-medium">
                  To
                </Label>
                <span className="text-sm text-muted-foreground">
                  Balance: {toTokenBalance} {toToken.symbol}
                </span>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="toAmount"
                  value={toAmount}
                  onChange={handleToAmountChange}
                  placeholder="0.0"
                  className="flex-1 h-14 text-lg font-medium border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  readOnly
                />
                <Select
                  value={toToken.address}
                  onValueChange={(value) =>
                    setToToken(
                      SUPPORTED_CHAINS[0].tokens.find((t) => t.address === value) || SUPPORTED_CHAINS[0].tokens[1],
                    )
                  }
                >
                  <SelectTrigger className="w-[140px] h-14 border-0 bg-transparent focus:ring-0">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CHAINS[0].tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-2">
                            <span className="text-xs">{token.symbol.substring(0, 2)}</span>
                          </div>
                          {token.symbol}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">
                  1 {fromToken.symbol} ≈ {(Number(toAmount) / Number(fromAmount)).toFixed(6) || "0.000000"}{" "}
                  {toToken.symbol}
                </span>
              </div>

              {priceImpact !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span
                    className={
                      priceImpact < 1
                        ? "text-green-500 font-medium"
                        : priceImpact < 5
                          ? "text-yellow-500 font-medium"
                          : "text-red-500 font-medium"
                    }
                  >
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="font-medium">{slippage.toFixed(1)}%</span>
              </div>
            </div>

            <AnimatePresence>
              {priceImpact !== null && priceImpact > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    variant="destructive"
                    className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>High Price Impact</AlertTitle>
                    <AlertDescription>
                      Your swap has a price impact of {priceImpact.toFixed(2)}%, which is considered high.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
              onClick={confirmSwap}
              disabled={!fromAmount || Number(fromAmount) <= 0 || isLoading || !isConnected}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Swapping...
                </>
              ) : !isConnected ? (
                "Connect Wallet"
              ) : (
                "Swap"
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Settings</DialogTitle>
            <DialogDescription>Adjust your slippage tolerance and transaction deadline</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Slippage Tolerance</Label>
                <span className="text-sm font-medium">{slippage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Slider
                  defaultValue={[slippage]}
                  max={5}
                  step={0.1}
                  onValueChange={handleSlippageChange}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your transaction will revert if the price changes unfavorably by more than this percentage.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Transaction Speed</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="w-full">
                  Standard
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                >
                  Fast
                </Button>
                <Button variant="outline" className="w-full">
                  Instant
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher gas fees will result in faster transaction confirmations.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">From</span>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">{fromToken.symbol.substring(0, 2)}</span>
                  </div>
                  <span className="font-medium">
                    {fromAmount} {fromToken.symbol}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">{toToken.symbol.substring(0, 2)}</span>
                  </div>
                  <span className="font-medium">
                    {toAmount} {toToken.symbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">
                  1 {fromToken.symbol} ≈ {(Number(toAmount) / Number(fromAmount)).toFixed(6)} {toToken.symbol}
                </span>
              </div>

              {priceImpact !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span
                    className={
                      priceImpact < 1
                        ? "text-green-500 font-medium"
                        : priceImpact < 5
                          ? "text-yellow-500 font-medium"
                          : "text-red-500 font-medium"
                    }
                  >
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="font-medium">{slippage.toFixed(1)}%</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Received</span>
                <span className="font-medium">
                  {((Number(toAmount) * (100 - slippage)) / 100).toFixed(6)} {toToken.symbol}
                </span>
              </div>
            </div>

            {priceImpact !== null && priceImpact > 5 && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>High Price Impact</AlertTitle>
                <AlertDescription>
                  Your swap has a price impact of {priceImpact.toFixed(2)}%, which is considered high. You may receive
                  significantly less tokens than expected.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="sm:flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSwap}
              className="sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Confirm Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
