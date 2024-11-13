// components/dashboard/banktransactions-table.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Transaction {
  BankTransactionID: string;
  Reference: string;
  Total: number;
  Contact: {
    Name: string;
  };
  Status: string;
  Date: string;
}

export const BankTransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  const formatDate = (dateString: string): string => {
    const match = dateString.match(/\d+/);
    if (match && match[0]) {
      const date = new Date(parseInt(match[0], 10));
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return dateString; // Return the original string if the match is null
  };

  // Slice the transactions array to get the first 7 items
  const slicedTransactions = transactions.slice(0, 7);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Bank Transactions</CardTitle>
          <CardDescription>
            Recent bank transactions from your account.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/bank-transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slicedTransactions.map((transaction: Transaction) => (
              <TableRow key={transaction.BankTransactionID}>
                <TableCell>{transaction.Reference}</TableCell>
                <TableCell>${transaction.Total.toFixed(2)}</TableCell>
                <TableCell>{transaction.Contact.Name}</TableCell>
                <TableCell>
                  <Badge className="text-xs" variant="outline">
                    {transaction.Status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.Date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
