// components/dashboard/unreconciled-statuscard.tsx

import { useTheme } from "next-themes"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUnreconciledBankTransactions } from "@/components/hooks/use-unreconciled-banktransactions"

export function UnreconciledStatusCard({ selectedTenantId }: { selectedTenantId: string | null }) {
  const { theme: mode } = useTheme()
  const { unreconciledCount, totalTransactions, trend, trendData, loading, error } = useUnreconciledBankTransactions(selectedTenantId)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const percentage = totalTransactions > 0 ? ((unreconciledCount / totalTransactions) * 100).toFixed(2) : '0.00'
  const trendIndicator = trend > 0 ? '↑' : trend < 0 ? '↓' : ''

  // Hardcoded theme for demonstration purposes
  const primaryColor = mode === "dark" ? "#06b6d4" : "#0e7490"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-bold">Unreconciled Bank Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{unreconciledCount}</div>
        <p className="text-xs text-muted-foreground">
          {percentage}% of total transactions
        </p>
        <p className="text-xs text-muted-foreground">
          Trend: {trendIndicator} {Math.abs(trend)}
        </p>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="unreconciledCount"
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ r: 6, stroke: primaryColor, fill: primaryColor }}
                activeDot={{ r: 8, stroke: primaryColor, fill: primaryColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default UnreconciledStatusCard
