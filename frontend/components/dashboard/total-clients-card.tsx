import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContacts } from "@/components/hooks/use-contacts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartConfig } from "@/components/ui/chart";

export function TotalClientsCard() {
  const { contactsCount, activeClientsCount, suppliersCount, customersCount, loading, error } = useContacts();

  const chartConfig = {
    Active: {
      label: "Active",
      color: "var(--chart-1)"
    },
    Suppliers: {
      label: "Suppliers",
      color: "var(--chart-2)"
    },
    Customers: {
      label: "Customers",
      color: "var(--chart-3)"
    }
  } satisfies ChartConfig;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const chartData = [
    { name: "Active", Active: activeClientsCount },
    { name: "Suppliers", Suppliers: suppliersCount },
    { name: "Customers", Customers: customersCount },
  ];

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Clients: {contactsCount}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <BarChart width={300} height={200} data={chartData}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill={chartConfig.Active.color} />
          <Bar dataKey="Suppliers" fill={chartConfig.Suppliers.color} />
          <Bar dataKey="Customers" fill={chartConfig.Customers.color} />
        </BarChart>
      </CardContent>
    </Card>
  );
}
