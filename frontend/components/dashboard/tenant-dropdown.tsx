// app/components/dashboard/tenant-dropdown.tsx
import { Package2, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTenant } from '@/components/hooks/use-tenant';
import { useEffect } from 'react';

interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantType: string;
}

export function TenantDropdown({ initialTenants }: { initialTenants: Tenant[] }) {
  const {
    tenants,
    selectedTenant,
    isLoading,
    selectTenant,
    setSelectedTenant,
  } = useTenant(initialTenants);

  useEffect(() => {
    if (initialTenants.length > 0 && !selectedTenant) {
      setSelectedTenant(initialTenants[0]);
    }
  }, [initialTenants, selectedTenant, setSelectedTenant]);

  const handleTenantSelect = async (tenant: any) => {
    try {
      await selectTenant(tenant);
      // Reload the page after successfully selecting a tenant
      window.location.reload();
    } catch (err) {
      console.error('Failed to select tenant:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="link" 
          className={cn(
            "flex items-center gap-2 text-lg font-semibold md:text-base",
            "transition-all duration-200 ease-in-out",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          <Package2 className={cn(
            "h-6 w-6",
            isLoading && "animate-pulse"
          )} />
          <span>{selectedTenant ? selectedTenant.tenantName : ''}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            "dropdown-open:rotate-180"
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start"
        className="w-[200px] p-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          tenants.map((tenant) => (
            <DropdownMenuItem 
              key={tenant.tenantId}
              onClick={() => handleTenantSelect(tenant)}
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selectedTenant?.tenantId === tenant.tenantId && 
                "bg-accent text-accent-foreground"
              )}
            >
              {tenant.tenantName}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}