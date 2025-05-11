import { SUPPORTED_CHAINS } from "@/constants/chains"

// Get token price from the token list
export const getTokenPrice = (tokenAddress: string) => {
  const token = SUPPORTED_CHAINS[0].tokens.find((t) => t.address === tokenAddress)
  return token?.price || 0
}

// Calculate the amount out based on the amount in and the token prices
export const calculateAmountOut = async (fromToken: any, toToken: any, amountIn: string) => {
  // In a real app, this would call the router's getAmountsOut function
  // For now, we'll use a simple price-based calculation
  const fromTokenPrice = getTokenPrice(fromToken.address)
  const toTokenPrice = getTokenPrice(toToken.address)

  if (fromTokenPrice === 0 || toTokenPrice === 0) {
    throw new Error("Token price not available")
  }

  const valueIn = Number(amountIn) * fromTokenPrice
  const amountOut = valueIn / toTokenPrice

  // Simulate some price impact
  const priceImpact = calculatePriceImpact(Number(amountIn), fromTokenPrice)

  // Apply price impact to the amount out
  const adjustedAmountOut = amountOut * (1 - priceImpact / 100)

  return {
    amountOut: adjustedAmountOut.toString(),
    priceImpact,
  }
}

// Calculate price impact based on the trade size
export const calculatePriceImpact = (amountIn: number, tokenPrice: number) => {
  // In a real app, this would be calculated based on the pool reserves
  // For now, we'll use a simple formula that increases with the trade size
  const tradeValue = amountIn * tokenPrice

  // Simulate price impact increasing with trade size
  // Small trades: 0-0.5%, Medium trades: 0.5-2%, Large trades: 2-10%
  if (tradeValue < 1000) {
    return Math.random() * 0.5 // 0-0.5% for small trades
  } else if (tradeValue < 10000) {
    return 0.5 + Math.random() * 1.5 // 0.5-2% for medium trades
  } else {
    return 2 + Math.random() * 8 // 2-10% for large trades
  }
}

// Get price impact color based on the impact percentage
export const getPriceImpact = (impact: number) => {
  if (impact < 1) {
    return "text-green-500"
  } else if (impact < 5) {
    return "text-yellow-500"
  } else {
    return "text-red-500"
  }
}
