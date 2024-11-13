"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, Cell } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useInvoices } from "@/components/hooks/use-invoice"
import { useTenant } from "@/components/hooks/use-tenant"
import { processInvoices } from "@/components/utils/process-invoices"

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const chartConfig: ChartConfig = {
  PAID: {
    label: "Paid",
    color: "var(--chart-1)",
  },
  AUTHORISED: {
    label: "Authorised",
    color: "var(--chart-2)",
  },
  DRAFT: {
    label: "Draft",
    color: "var(--chart-3)",
  },
  DELETED: {
    label: "Deleted",
    color: "var(--chart-4)",
  },
  VOIDED: {
    label: "Voided",
    color: "var(--chart-5)",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "var(--chart-6)",
  },
  // Add more statuses as needed
}

export default function InvoicesPieChart() {
  const id = "invoices-pie-chart"
  const { selectedTenant } = useTenant();
  const { invoices, loading, error } = useInvoices(selectedTenant?.tenantId || null);
  const [activeStatus, setActiveStatus] = React.useState<string | null>(null);

  const statusData = React.useMemo(() => {
    if (invoices.length === 0) return [];
    return processInvoices(invoices);
  }, [invoices]);

  const activeIndex = React.useMemo(
    () => statusData.findIndex((item) => item.status === activeStatus),
    [activeStatus, statusData]
  );

  const statuses = React.useMemo(() => statusData.map((item) => item.status), [statusData]);

  console.log("Status Data:", statusData); // Debugging log

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Invoice Status Distribution</CardTitle>
          <CardDescription>Visual breakdown of invoice statuses</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
                onClick={(data, index) => setActiveStatus(data.status)}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {statusData[activeIndex]?.count.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            {statusData[activeIndex]?.status}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
