// app/components/hooks/use-tenant.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/app/config';

interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantType: string;
}

interface UseTenantReturn {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  selectTenant: (tenant: Tenant) => Promise<void>;
  resetTenantError: () => void;
  setSelectedTenant: (tenant: Tenant | null) => void;
}

export function useTenant(initialTenants: Tenant[] = []): UseTenantReturn {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedTenant');
      return saved ? JSON.parse(saved) : null;
    }
    return initialTenants.length > 0 ? initialTenants[0] : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiBaseUrl } = config;

  // Persist selected tenant to localStorage
  useEffect(() => {
    if (selectedTenant && typeof window !== 'undefined') {
      localStorage.setItem('selectedTenant', JSON.stringify(selectedTenant));
    }
  }, [selectedTenant]);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${apiBaseUrl}/tenants`, {
        withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch tenants: ${response.statusText}`);
      }

      const data = response.data;
      if (!data || !Array.isArray(data.tenants)) {
        throw new Error('Invalid response structure');
      }

      setTenants(data.tenants);

      // Validate stored tenant still exists in the list
      if (selectedTenant) {
        const stillExists = data.tenants.some(
          (t: Tenant) => t.tenantId === selectedTenant.tenantId
        );
        if (!stillExists) {
          setSelectedTenant(data.tenants[0] || null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('selectedTenant');
          }
        }
      } else {
        setSelectedTenant(data.tenants[0] || null);
      }
    } catch (err: any) {
      console.error('Error fetching tenants:', err);
      setError('Failed to fetch tenants. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectTenant = async (tenant: Tenant) => {
    try {
      setError(null);
      const response = await axios.post(
        `${apiBaseUrl}/select-tenant/${tenant.tenantId}`,
        {},  // No request body needed for this POST request
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSelectedTenant(tenant);
        return;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to select tenant';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetTenantError = () => setError(null);

  return {
    tenants,
    selectedTenant,
    isLoading,
    error,
    fetchTenants,
    selectTenant,
    resetTenantError,
    setSelectedTenant,
  };
}