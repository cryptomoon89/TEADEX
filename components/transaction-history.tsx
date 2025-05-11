"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import { SUPPORTED_CHAINS } from "@/constants/chains"
import { useWeb3 } from "@/providers/web3-provider"

type Transaction = {
  id: string
  type: "swap" | "addLiquidity" | "removeLiquidity"
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  hash: string
  details: {
    fromToken?: string
    toToken?: string
    fromAmount?: string
    toAmount?: string
    tokenA?: string
    tokenB?: string
    amountA?: string
    amountB?: string
    lpAmount?: string
  }
}

export function TransactionHistory() {
  const { address, isConnected } = useWeb3()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchTransactionHistory()
    } else {
      setTransactions([])
      setIsLoading(false)
    }
  }, [address])

  const fetchTransactionHistory = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would fetch transaction history from an indexer or API
      // For now, we'll use mock data
      setTimeout(() => {
        setTransactions([
          {
            id: "1",
            type: "swap",
            timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
            status: "confirmed",
            hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            details: {
              fromToken: "SEP",
              toToken: "tUSDC",
              fromAmount: "1.0",
              toAmount: "1500.0",
            },
          },
          {
            id: "2",
            type: "addLiquidity",
            timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
            status: "confirmed",
            hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            details: {
              tokenA: "SEP",
              tokenB: "tUSDC",
              amountA: "5.0",
              amountB: "7500.0",
              lpAmount: "6.12",
            },
          },
          {
            id: "3",
            type: "swap",
            timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
            status: "failed",
            hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
            details: {
              fromToken: "tDAI",
              toToken: "tWBTC",
              fromAmount: "100.0",
              toAmount: "0.005",
            },
          },
          {
            id: "4",
            type: "removeLiquidity",
            timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            status: "confirmed",
            hash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
            details: {
              tokenA: "SEP",
              tokenB: "tDAI",
              amountA: "2.5",
              amountB: "250.0",
              lpAmount: "3.54",
            },
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Confirmed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Failed
          </Badge>
        )
    }
  }

  const getTransactionTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "swap":
        return "Swap"
      case "addLiquidity":
        return "Add Liquidity"
      case "removeLiquidity":
        return "Remove Liquidity"
    }
  }

  const getTransactionDetails = (transaction: Transaction) => {
    switch (transaction.type) {
      case "swap":
        return (
          <span>
            Swap {transaction.details.fromAmount} {transaction.details.fromToken} for {transaction.details.toAmount}{" "}
            {transaction.details.toToken}
          </span>
        )
      case "addLiquidity":
        return (
          <span>
            Add {transaction.details.amountA} {transaction.details.tokenA} and {transaction.details.amountB}{" "}
            {transaction.details.tokenB}
          </span>
        )
      case "removeLiquidity":
        return (
          <span>
            Remove {transaction.details.amountA} {transaction.details.tokenA} and {transaction.details.amountB}{" "}
            {transaction.details.tokenB}
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>

      {!isConnected ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Connect your wallet to view transaction history.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Explorer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{getTransactionTypeLabel(tx.type)}</TableCell>
                  <TableCell>{getTransactionDetails(tx)}</TableCell>
                  <TableCell>{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`${SUPPORTED_CHAINS[0].blockExplorers.default.url}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No transactions found.</p>
        </div>
      )}
    </div>
  )
}
