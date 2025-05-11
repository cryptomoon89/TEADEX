"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SUPPORTED_CHAINS } from "@/constants/chains"
import { Search } from "lucide-react"

export function TokensTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const tokens = SUPPORTED_CHAINS[0].tokens

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTokens.map((token) => (
              <TableRow key={token.address}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="font-bold text-xs">{token.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${token.price?.toFixed(2) || "0.00"}</TableCell>
                <TableCell>
                  <span className={token.priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {token.priceChange >= 0 ? "+" : ""}
                    {token.priceChange?.toFixed(2) || "0.00"}%
                  </span>
                </TableCell>
                <TableCell className="text-right">${token.marketCap?.toLocaleString() || "0"}</TableCell>
              </TableRow>
            ))}

            {filteredTokens.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No tokens found matching "{searchQuery}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
