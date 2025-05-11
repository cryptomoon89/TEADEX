"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the chart
const generateChartData = () => {
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: Math.floor(Math.random() * 500000) + 500000,
      transactions: Math.floor(Math.random() * 500) + 500,
    })
  }

  return data
}

export function NetworkStats() {
  const [chartData, setChartData] = useState(generateChartData())
  const [activeMetric, setActiveMetric] = useState<"volume" | "transactions">("volume")

  // Regenerate data every 30 seconds to simulate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: "Total Volume (24h)",
      value: "$1,245,678",
      change: "+5.67%",
      isPositive: true,
    },
    {
      title: "Total Liquidity",
      value: "$8,765,432",
      change: "+2.34%",
      isPositive: true,
    },
    {
      title: "Total Transactions (24h)",
      value: "1,234",
      change: "+12.5%",
      isPositive: true,
    },
  ]

  return (
    <Card className="w-full border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
        <CardTitle>DEX Analytics</CardTitle>
        <CardDescription>Trading volume and liquidity statistics</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>{stat.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 h-64 border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Network Activity</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${
                  activeMetric === "volume"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setActiveMetric("volume")}
              >
                Volume
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${
                  activeMetric === "transactions"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setActiveMetric("transactions")}
              >
                Transactions
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) =>
                  activeMetric === "volume" ? `$${(value / 1000).toFixed(0)}k` : value.toString()
                }
              />
              <Tooltip
                formatter={(value) =>
                  activeMetric === "volume"
                    ? [`$${Number(value).toLocaleString()}`, "Volume"]
                    : [Number(value).toLocaleString(), "Transactions"]
                }
              />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={activeMetric === "volume" ? "#3b82f6" : "#8b5cf6"}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
