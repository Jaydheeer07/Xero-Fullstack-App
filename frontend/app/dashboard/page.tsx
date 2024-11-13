// app/dashboard/page.tsx
import React from "react";
import Dashboard from "@/components/dashboard-01";
import config from '@/app/config';

interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantType: string;
}

const { apiBaseUrl } = config;
const DashboardPage = async () => {
  
  const response = await fetch(`${apiBaseUrl}/tenants`, {
    credentials: 'include', // Include credentials (cookies) in the request
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tenants: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.tenants)) {
    throw new Error('Invalid response structure');
  }

  const initialTenants: Tenant[] = data.tenants;

  return <Dashboard initialTenants={initialTenants} />;
};

export default DashboardPage;