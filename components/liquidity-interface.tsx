"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RefreshCw, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { SUPPORTED_CHAINS } from "@/constants/chains"
import { calculateLiquidityShare } from "@/lib/liquidity-utils"
import { useWeb3 } from "@/providers/web3-provider"

export function LiquidityInterface() {
  const { address, isConnected } = useWeb3()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("add")
  const [tokenA, setTokenA] = useState(SUPPORTED_CHAINS[0].tokens[0])
  const [tokenB, setTokenB] = useState(SUPPORTED_CHAINS[0].tokens[1])
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [poolShare, setPoolShare] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [userLiquidityPositions, setUserLiquidityPositions] = useState<any[]>([])
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null)
  const [removePercentage, setRemovePercentage] = useState("100")
  const [tokenABalance, setTokenABalance] = useState("10.0000")
  const [tokenBBalance, setTokenBBalance] = useState("1000.0000")

  useEffect(() => {
    // Simulate fetching balances
    if (address) {
      setTokenABalance(Math.random() * 20 + 5).toFixed(4)
      setTokenBBalance(Math.random() * 2000 + 500).toFixed(4)
    }
  }, [address, tokenA, tokenB])

  useEffect(() => {
    if (address) {
      fetchUserLiquidityPositions()
    }
  }, [address])

  useEffect(() => {
    if (amountA && amountB) {
      calculatePoolShare()
    } else {
      setPoolShare(null)
    }
  }, [amountA, amountB, tokenA, tokenB])

  const fetchUserLiquidityPositions = async () => {
    try {
      // In a real app, this would fetch the user's liquidity positions from the contracts
      // For now, we'll use mock data
      setUserLiquidityPositions([
        {
          id: "1",
          tokenA: SUPPORTED_CHAINS[0].tokens[0],
          tokenB: SUPPORTED_CHAINS[0].tokens[1],
          amountA: "10.0",
          amountB: "15.0",
          lpTokens: "12.5",
          poolShare: 0.05,
        },
        {
          id: "2",
          tokenA: SUPPORTED_CHAINS[0].tokens[0],
          tokenB: SUPPORTED_CHAINS[0].tokens[2],
          amountA: "5.0",
          amountB: "100.0",
          lpTokens: "22.36",
          poolShare: 0.02,
        },
      ])
    } catch (error) {
      console.error("Error fetching liquidity positions:", error)
      toast({
        variant: "destructive",
        title: "Failed to Load",
        description: "Could not load your liquidity positions. Please try again.",
      })
    }
  }

  const calculatePoolShare = async () => {
    try {
      if (!amountA || !amountB || Number(amountA) <= 0 || Number(amountB) <= 0) return

      // In a real app, this would calculate the pool share based on the current pool reserves
      const share = await calculateLiquidityShare(tokenA, tokenB, amountA, amountB)
      setPoolShare(share)
    } catch (error) {
      console.error("Error calculating pool share:", error)
    }
  }

  const handleAmountAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountA(value)

      // In a real app, this would calculate the corresponding amount of token B based on the pool ratio
      if (value && Number(value) > 0) {
        // Mock calculation - in a real app, this would use the actual pool ratio
        setAmountB((Number(value) * 1.5).toString())
      } else {
        setAmountB("")
      }
    }
  }

  const handleAmountBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountB(value)

      // In a real app, this would calculate the corresponding amount of token A based on the pool ratio
      if (value && Number(value) > 0) {
        // Mock calculation - in a real app, this would use the actual pool ratio
        setAmountA((Number(value) / 1.5).toString())
      } else {
        setAmountA("")
      }
    }
  }

  const handleMaxAClick = () => {
    if (tokenABalance) {
      // Leave a small amount for gas if the token is native
      if (tokenA.address === "native") {
        const balance = Number(tokenABalance)
        const maxAmount = Math.max(balance - 0.01, 0).toString()
        setAmountA(maxAmount)
      } else {
        setAmountA(tokenABalance)
      }

      // Calculate corresponding amount B
      const amountA = tokenA.address === "native" ? Math.max(Number(tokenABalance) - 0.01, 0) : Number(tokenABalance)

      setAmountB((amountA * 1.5).toString())
    }
  }

  const handleMaxBClick = () => {
    if (tokenBBalance) {
      // Leave a small amount for gas if the token is native
      if (tokenB.address === "native") {
        const balance = Number(tokenBBalance)
        const maxAmount = Math.max(balance - 0.01, 0).toString()
        setAmountB(maxAmount)
      } else {
        setAmountB(tokenBBalance)
      }

      // Calculate corresponding amount A
      const amountB = tokenB.address === "native" ? Math.max(Number(tokenBBalance) - 0.01, 0) : Number(tokenBBalance)

      setAmountA((amountB / 1.5).toString())
    }
  }

  const confirmAddLiquidity = () => {
    setShowConfirmation(true)
  }

  const handleAddLiquidity = async () => {
    if (!address || !amountA || !amountB || Number(amountA) <= 0 || Number(amountB) <= 0) return

    setShowConfirmation(false)
    setIsLoading(true)

    try {
      // Simulate transaction
      setTimeout(() => {
        toast({
          title: "Liquidity Added",
          description: `Successfully added ${amountA} ${tokenA.symbol} and ${amountB} ${tokenB.symbol} to the pool.`,
        })
        setAmountA("")
        setAmountB("")
        setPoolShare(null)
        setIsLoading(false)
        fetchUserLiquidityPositions()
      }, 2000)
    } catch (error) {
      console.error("Add liquidity error:", error)
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "There was an error adding liquidity. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const handleSelectPosition = (position: any) => {
    setSelectedPosition(position)
    setRemovePercentage("100")
  }

  const handleRemovePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = Number(value)
      if (numValue >= 0 && numValue <= 100) {
        setRemovePercentage(value)
      }
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!address || !selectedPosition) return

    setIsLoading(true)

    try {
      // Simulate transaction
      setTimeout(() => {
        toast({
          title: "Liquidity Removed",
          description: `Successfully removed ${removePercentage}% of your liquidity position.`,
        })
        setSelectedPosition(null)
        setRemovePercentage("100")
        setIsLoading(false)
        fetchUserLiquidityPositions()
      }, 2000)
    } catch (error) {
      console.error("Remove liquidity error:", error)
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "There was an error removing liquidity. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Liquidity</TabsTrigger>
          <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="amountA">Token A</Label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {tokenABalance} {tokenA.symbol}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="amountA"
                        value={amountA}
                        onChange={handleAmountAChange}
                        placeholder="0.0"
                        className="pr-16"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                        onClick={handleMaxAClick}
                      >
                        MAX
                      </Button>
                    </div>
                    <Select
                      value={tokenA.address}
                      onValueChange={(value) =>
                        setTokenA(
                          SUPPORTED_CHAINS[0].tokens.find((t) => t.address === value) || SUPPORTED_CHAINS[0].tokens[0],
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CHAINS[0].tokens.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
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
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="amountB">Token B</Label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {tokenBBalance} {tokenB.symbol}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="amountB"
                        value={amountB}
                        onChange={handleAmountBChange}
                        placeholder="0.0"
                        className="pr-16"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                        onClick={handleMaxBClick}
                      >
                        MAX
                      </Button>
                    </div>
                    <Select
                      value={tokenB.address}
                      onValueChange={(value) =>
                        setTokenB(
                          SUPPORTED_CHAINS[0].tokens.find((t) => t.address === value) || SUPPORTED_CHAINS[0].tokens[1],
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CHAINS[0].tokens.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
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

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Pool Share</span>
                  <span>{poolShare !== null ? poolShare.toFixed(4) : "0.0000"}%</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Exchange Rate</span>
                  <span>
                    1 {tokenA.symbol} = {(Number(amountB) / Number(amountA)).toFixed(6) || "0.000000"} {tokenB.symbol}
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={confirmAddLiquidity}
                  disabled={
                    !amountA || !amountB || Number(amountA) === 0 || Number(amountB) === 0 || isLoading || !isConnected
                  }
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Adding Liquidity...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet"
                  ) : (
                    "Add Liquidity"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remove">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Your Liquidity Positions</h3>

                {userLiquidityPositions.length > 0 ? (
                  <div className="space-y-4">
                    {userLiquidityPositions.map((position) => (
                      <div
                        key={position.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPosition?.id === position.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSelectPosition(position)}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {position.tokenA.symbol}/{position.tokenB.symbol}
                          </span>
                          <span>{position.lpTokens} LP Tokens</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Pool share:</span>
                          <span>{(position.poolShare * 100).toFixed(4)}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{position.tokenA.symbol}:</span>
                          <span>{position.amountA}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{position.tokenB.symbol}:</span>
                          <span>{position.amountB}</span>
                        </div>
                      </div>
                    ))}

                    {selectedPosition && (
                      <div className="p-4 border rounded-lg mt-4">
                        <h4 className="font-medium mb-2">Remove Liquidity</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="removePercentage">Amount to Remove (%)</Label>
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                id="removePercentage"
                                value={removePercentage}
                                onChange={handleRemovePercentageChange}
                                className="flex-1"
                              />
                              <span>%</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>You will receive:</span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span>
                                  {((Number(selectedPosition.amountA) * Number(removePercentage)) / 100).toFixed(6)}{" "}
                                  {selectedPosition.tokenA.symbol}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>
                                  {((Number(selectedPosition.amountB) * Number(removePercentage)) / 100).toFixed(6)}{" "}
                                  {selectedPosition.tokenB.symbol}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleRemoveLiquidity}
                            disabled={isLoading || !removePercentage || Number(removePercentage) === 0}
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Removing Liquidity...
                              </>
                            ) : (
                              <>
                                <Minus className="mr-2 h-4 w-4" />
                                Remove Liquidity
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground mb-4">No liquidity positions found.</p>
                    <Button variant="outline" onClick={() => setActiveTab("add")}>
                      Add Liquidity
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Add Liquidity</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span>{tokenA.symbol}</span>
                <span className="font-medium">{amountA}</span>
              </div>
              <div className="flex justify-between">
                <span>{tokenB.symbol}</span>
                <span className="font-medium">{amountB}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span>
                  1 {tokenA.symbol} = {(Number(amountB) / Number(amountA)).toFixed(6)} {tokenB.symbol}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pool Share</span>
                <span>{poolShare !== null ? poolShare.toFixed(4) : "0.0000"}%</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="sm:flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddLiquidity} className="sm:flex-1">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
