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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { FaDollarSign, FaExclamationTriangle } from "react-icons/fa"; // Import icons

export function AccountReceivablesCard() {
  const { outstandingReceivables, overdueReceivables, loading, error } = useContacts();

  if (loading) {
    return <div className="col-span-full"> <LoadingSpinner /> </div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const chartData = [
    {
      type: "Account Receivables",
      Outstanding: outstandingReceivables,
      Overdue: overdueReceivables
    }
  ];

  const totalReceivables = outstandingReceivables + overdueReceivables;

  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="items-center pb-0 px-6">
        <CardTitle>Account Receivables</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0 px-6">
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
          width={300}
          height={200}
        >
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
            dataKey="Outstanding"
            stackId="a"
            cornerRadius={5}
            fill="var(--chart-1)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="Overdue"
            stackId="a"
            cornerRadius={5}
            fill="var(--chart-2)"
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm px-6">
        <div className="flex items-center gap-2 font-medium leading-none bg-gray-100 p-2 rounded-md">
          <FaDollarSign className="text-green-500" />
          <span>Outstanding: {outstandingReceivables.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 font-medium leading-none bg-gray-100 p-2 rounded-md">
          <FaExclamationTriangle className="text-red-500" />
          <span>Overdue: {overdueReceivables.toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AccountReceivablesCard;
