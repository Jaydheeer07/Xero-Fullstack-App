// hooks/use-banktransaction.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/app/config';

export const useBankTransactions = (selectedTenantId: string | null) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { apiBaseUrl } = config;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedTenantId) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/bank-transactions`, {
          withCredentials: true
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;
        console.log('Fetched data:', data); // Debugging statement

        if (!data || !Array.isArray(data.BankTransactions)) {
          throw new Error('Invalid response structure');
        }

        setTransactions(data.BankTransactions);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTenantId, apiBaseUrl]);

  return { transactions, loading, error };
};