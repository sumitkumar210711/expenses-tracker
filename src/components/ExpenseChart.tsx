import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(210, 100%, 45%)',
  'hsl(142, 76%, 36%)',
  'hsl(0, 85%, 60%)',
  'hsl(45, 93%, 58%)',
  'hsl(280, 100%, 45%)',
  'hsl(25, 95%, 53%)',
  'hsl(195, 100%, 45%)',
  'hsl(120, 60%, 50%)'
];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  // Prepare data for category spending pie chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      if (acc[transaction.category]) {
        acc[transaction.category] += transaction.amount;
      } else {
        acc[transaction.category] = transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  // Prepare data for daily spending bar chart
  const dailyData = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expense += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number }>);

  const barData = Object.values(dailyData).slice(-7); // Last 7 days

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-gradient animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-gradient animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Daily Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                <Legend />
                <Bar dataKey="income" fill="hsl(142, 76%, 36%)" name="Income" />
                <Bar dataKey="expense" fill="hsl(0, 85%, 60%)" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No transaction data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}