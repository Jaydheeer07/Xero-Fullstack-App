// app/components/dashboard-01.tsx
"use client"; // Ensure this is a client component

import { useEffect } from 'react';
import { TenantDropdown } from "@/components/dashboard/tenant-dropdown";
import { UserNav } from "@/components/dashboard/usernav";
import { ErrorDialog } from "@/components/dashboard/error-dialog";
import { BankTransactionsTable } from "@/components/dashboard/banktransactions-table";
import { useTenant } from "@/components/hooks/use-tenant";
import { useBankTransactions } from "@/components/hooks/use-banktransaction";
import InvoicesPieChart from "@/components/dashboard/invoices-piechart";
import { UnreconciledStatusCard } from "@/components/dashboard/unreconciled-statuscard";
import { TotalClientsCard } from "@/components/dashboard/total-clients-card";
import { AccountReceivablesCard } from "@/components/dashboard/account-receivables-card";
import { AccountPayablesCard } from "@/components/dashboard/account-payables-card";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/ui/loading-spinner";

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

  const currentPage = "Dashboard"; // Set the current page here

  return (
    <SidebarProvider>
      <AppSidebar initialTenants={initialTenants} currentPage={currentPage} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Overview
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {/* Other cards */}
            <UnreconciledStatusCard selectedTenantId={selectedTenant?.tenantId || null} />
            <TotalClientsCard />
            <AccountReceivablesCard />
            <AccountPayablesCard />
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                <BankTransactionsTable transactions={transactions} />
                <InvoicesPieChart />
                {/* Other cards */}
              </>
            )}
          </div>
        </main>
        <ErrorDialog />
      </SidebarInset>
    </SidebarProvider>
  );
}