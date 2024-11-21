// hooks/use-contacts.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/app/config';

interface Contact {
  ContactID: string;
  ContactStatus: string;
  IsSupplier: boolean;
  IsCustomer: boolean;
  Balances?: {
    AccountsReceivable: {
      Outstanding: number;
      Overdue: number;
    };
    AccountsPayable: {
      Outstanding: number;
      Overdue: number;
    };
  };
}

export const useContacts = () => {
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [activeClientsCount, setActiveClientsCount] = useState<number>(0);
  const [suppliersCount, setSuppliersCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [outstandingReceivables, setOutstandingReceivables] = useState<number>(0);
  const [overdueReceivables, setOverdueReceivables] = useState<number>(0);
  const [outstandingPayables, setOutstandingPayables] = useState<number>(0);
  const [overduePayables, setOverduePayables] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { apiBaseUrl } = config;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/contacts`, {
          withCredentials: true,
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;
        console.log('Fetched contacts:', data); // Debugging statement

        if (!data || !Array.isArray(data.Contacts)) {
          throw new Error('Invalid response structure');
        }

        const contacts: Contact[] = data.Contacts;
        const count = contacts.length;
        const activeClients = contacts.filter(contact => contact.ContactStatus === 'ACTIVE').length;
        const suppliers = contacts.filter(contact => contact.IsSupplier).length;
        const customers = contacts.filter(contact => contact.IsCustomer).length;

        let totalOutstandingReceivables = 0;
        let totalOverdueReceivables = 0;
        let totalOutstandingPayables = 0;
        let totalOverduePayables = 0;

        contacts.forEach(contact => {
          if (contact.Balances) {
            totalOutstandingReceivables += contact.Balances.AccountsReceivable.Outstanding;
            totalOverdueReceivables += contact.Balances.AccountsReceivable.Overdue;
            totalOutstandingPayables += contact.Balances.AccountsPayable.Outstanding;
            totalOverduePayables += contact.Balances.AccountsPayable.Overdue;
          }
        });

        setContactsCount(count);
        setActiveClientsCount(activeClients);
        setSuppliersCount(suppliers);
        setCustomersCount(customers);
        setOutstandingReceivables(totalOutstandingReceivables);
        setOverdueReceivables(totalOverdueReceivables);
        setOutstandingPayables(totalOutstandingPayables);
        setOverduePayables(totalOverduePayables);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  return {
    contactsCount,
    activeClientsCount,
    suppliersCount,
    customersCount,
    outstandingReceivables,
    overdueReceivables,
    outstandingPayables,
    overduePayables,
    loading,
    error,
  };
};