// hooks/use-invoices.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/app/config';

export const useInvoices = (selectedTenantId: string | null) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { apiBaseUrl } = config;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedTenantId) {
          setInvoices([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/invoices`, {
          withCredentials: true
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;
        console.log('Fetched data:', data); // Debugging statement

        if (!data || !Array.isArray(data.Invoices)) {
          throw new Error('Invalid response structure');
        }

        setInvoices(data.Invoices);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTenantId, apiBaseUrl]);

  return { invoices, loading, error };
};