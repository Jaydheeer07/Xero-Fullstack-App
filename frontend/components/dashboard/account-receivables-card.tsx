// components/dashboard/account-receivables-card.tsx

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription,
  } from "@/components/ui/card";
  import { useContacts } from "@/components/hooks/use-contacts";
  import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";
  import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";
  
  export function AccountReceivablesCard() {
    const { outstandingReceivables, overdueReceivables, loading, error } = useContacts();
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    const chartData = [
        {
          type: "Account Payables",
          Outstanding: outstandingReceivables,
          Overdue: overdueReceivables
        }
      ];
    
      const chartConfig = {
        Outstanding: {
          label: "Outstanding ",
          color: "var(--chart-1)",
        },
        Overdue: {
          label: "Overdue ",
          color: "var(--chart-2)",
        },
      } satisfies ChartConfig;
    
      const totalReceivables = outstandingReceivables + overdueReceivables;
      return (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Account Receivables</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[250px]"
            >
              <RadialBarChart
                data={chartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalReceivables.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Receivables
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey= "Outstanding"
                  stackId="a"
                  cornerRadius={3}
                  fill={chartConfig.Outstanding.color}
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey= "Overdue"
                  stackId="a"
                  cornerRadius={3}
                  fill={chartConfig.Overdue.color}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Outstanding: {outstandingReceivables.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
            Overdue: {overdueReceivables.toLocaleString()}
            </div>
          </CardFooter>
        </Card>
      );
    }
    
  export default AccountReceivablesCard;