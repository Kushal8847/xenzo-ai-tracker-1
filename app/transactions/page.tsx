import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { type Transaction, mockTransactions } from "@/lib/data"

export default function TransactionsPage() {
  return (
    <Card className="material-background">
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>A complete history of your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.description}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.type === "income" ? "default" : "destructive"}
                    className={
                      transaction.type === "income"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
