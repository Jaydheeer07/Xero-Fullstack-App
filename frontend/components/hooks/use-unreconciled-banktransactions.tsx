// hooks/use-unreconciled-banktransactions.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import config from '@/app/config'

interface BankTransaction {
  IsReconciled: boolean;
  Date: string; // Date in the format "/Date(1723161600000)/"
  // Add other properties as needed
}

export const useUnreconciledBankTransactions = (selectedTenantId: string | null) => {
  const [unreconciledCount, setUnreconciledCount] = useState<number>(0)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [trend, setTrend] = useState<number>(0)
  const [trendData, setTrendData] = useState<{ month: string; unreconciledCount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { apiBaseUrl } = config

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedTenantId) {
          setUnreconciledCount(0)
          setTotalTransactions(0)
          setTrend(0)
          setTrendData([])
          setLoading(false)
          return
        }

        setLoading(true)
        const response = await axios.get(`${apiBaseUrl}/bank-transactions`, {
          withCredentials: true
        })

        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }

        const data = response.data
        console.log('Fetched Unreconciled transactions:', data) // Debugging statement

        if (!data || !Array.isArray(data.BankTransactions)) {
          throw new Error('Invalid response structure')
        }

        const transactions: BankTransaction[] = data.BankTransactions
        const unreconciled = transactions.filter(tx => tx.IsReconciled === false).length
        const total = transactions.length

        // Debugging statements
        console.log('Unreconciled transactions count:', unreconciled)
        console.log('Total transactions count:', total)

        // Group transactions by month and calculate unreconciled count for each month
        const groupedByMonth: { [key: string]: number } = {}
        transactions.forEach(tx => {
          const timestamp = parseInt(tx.Date.match(/\d+/)?.[0] || '0', 10)
          const date = new Date(timestamp)
          const month = `${date.getFullYear()}-${date.getMonth() + 1}`
          if (!groupedByMonth[month]) {
            groupedByMonth[month] = 0
          }
          if (!tx.IsReconciled) {
            groupedByMonth[month] += 1
          }
        })

        // Convert grouped data to array for line graph
        const trendDataArray = Object.keys(groupedByMonth).map(month => ({
          month,
          unreconciledCount: groupedByMonth[month]
        }))

        // Sort trendDataArray by month
        trendDataArray.sort((a, b) => {
          const [yearA, monthA] = a.month.split('-').map(Number)
          const [yearB, monthB] = b.month.split('-').map(Number)
          if (yearA !== yearB) {
            return yearA - yearB
          }
          return monthA - monthB
        })

        // Placeholder for previous period calculation
        const previousUnreconciled = unreconciled - 1
        const trendValue = unreconciled - previousUnreconciled

        setUnreconciledCount(unreconciled)
        setTotalTransactions(total)
        setTrend(trendValue)
        setTrendData(trendDataArray)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedTenantId, apiBaseUrl])

  return { unreconciledCount, totalTransactions, trend, trendData, loading, error }
}