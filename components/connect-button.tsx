"use client"

import { Button } from "@/components/ui/button"
import { formatAddress } from "@/lib/utils"
import { motion } from "framer-motion"
import { useWeb3 } from "@/providers/web3-provider"

export function ConnectButton() {
  const { address, isConnected, connect, disconnect } = useWeb3()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Button
        onClick={isConnected ? disconnect : connect}
        variant={isConnected ? "outline" : "default"}
        className={`
          ${
            isConnected
              ? "font-mono border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/50"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          }
          px-4 py-2 h-10 rounded-lg transition-all duration-200 shadow-sm hover:shadow
        `}
      >
        {isConnected ? (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            {formatAddress(address || "")}
          </div>
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </motion.div>
  )
}
