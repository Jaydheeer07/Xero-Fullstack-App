// app/components/app-sidebar.tsx

import * as React from "react"

import { TenantDropdown } from "@/components/dashboard/tenant-dropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroupLabel
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Transactions",
      url: "/transactions",
    },
    {
      title: "Invoices",
      url: "/invoices",
    },
    {
      title: "Contacts",
      url: "/contacts",
    },
    {
      title: "Accounts",
      url: "/accounts",
    },
  ],
}

export function AppSidebar({ initialTenants, currentPage, ...props }: React.ComponentProps<typeof Sidebar> & { initialTenants: any[]; currentPage: string }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TenantDropdown initialTenants={initialTenants} />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupContent>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={currentPage === item.title ? "active" : ""}>
                    <a href={item.url}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}