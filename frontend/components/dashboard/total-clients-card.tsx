// components/dashboard/total-clients-card.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useContacts } from "@/components/hooks/use-contacts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import LoadingSpinner from "@/components/ui/loading-spinner";

export function TotalClientsCard() {
  const { contactsCount, activeClientsCount, suppliersCount, customersCount, loading, error } = useContacts();

  if (loading) {
    return <div className="col-span-full"> <LoadingSpinner /> </div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const chartData = [
    { name: "Active", Active: activeClientsCount },
    { name: "Suppliers", Suppliers: suppliersCount },
    { name: "Customers", Customers: customersCount }
  ];

  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="items-center pb-0 px-6">
        <CardTitle>Total Clients: {contactsCount}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0 px-6">
        <BarChart width={300} height={200} data={chartData}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill="var(--chart-1)" />
          <Bar dataKey="Suppliers" fill="var(--chart-2)" />
          <Bar dataKey="Customers" fill="var(--chart-3)" />
        </BarChart>
      </CardContent>
    </Card>
  );
}

export default TotalClientsCard;
