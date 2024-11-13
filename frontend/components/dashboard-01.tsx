// app/components/dashboard-01.tsx
"use client"; // Ensure this is a client component

import { TenantDropdown } from "@/components/dashboard/tenant-dropdown";
import { UserNav } from "@/components/dashboard/usernav";
import { ErrorDialog } from "@/components/dashboard/error-dialog";
import { BankTransactionsTable } from "@/components/dashboard/banktransactions-table";
import { useTenant } from "@/components/hooks/use-tenant";
import { useBankTransactions } from "@/components/hooks/use-banktransaction";
import { useEffect } from 'react';
import InvoicesPieChart from "@/components/dashboard/invoices-piechart";
import { UnreconciledStatusCard } from "@/components/dashboard/unreconciled-statuscard"; // Import the new component

interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantType: string;
}

export default function Dashboard({ initialTenants }: { initialTenants: Tenant[] }) {
  const { selectedTenant, setSelectedTenant } = useTenant();
  const { transactions, loading, error } = useBankTransactions(selectedTenant?.tenantId || null);

  useEffect(() => {
    if (initialTenants.length > 0 && !selectedTenant) {
      setSelectedTenant(initialTenants[0]);
    }
  }, [initialTenants, selectedTenant, setSelectedTenant]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <TenantDropdown initialTenants={initialTenants} />
          <UserNav />
        </nav>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* Other cards */}
          <UnreconciledStatusCard selectedTenantId={selectedTenant?.tenantId || null} /> {/* Add the new component here */}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <BankTransactionsTable transactions={transactions} />
          )}
          <InvoicesPieChart />
          {/* Other cards */}
        </div>
      </main>

      <ErrorDialog />
    </div>
  );
}