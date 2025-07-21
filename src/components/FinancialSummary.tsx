import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savings = balance > 0 ? balance : 0;

  // Calculate this month's data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: ArrowUpCircle,
      gradient: 'income-gradient',
      textColor: 'text-income-foreground',
      bgColor: 'bg-income/10',
      iconColor: 'text-income'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: ArrowDownCircle,
      gradient: 'expense-gradient',
      textColor: 'text-expense-foreground',
      bgColor: 'bg-expense/10',
      iconColor: 'text-expense'
    },
    {
      title: 'Current Balance',
      amount: balance,
      icon: DollarSign,
      gradient: balance >= 0 ? 'primary-gradient' : 'expense-gradient',
      textColor: balance >= 0 ? 'text-primary-foreground' : 'text-expense-foreground',
      bgColor: balance >= 0 ? 'bg-primary/10' : 'bg-expense/10',
      iconColor: balance >= 0 ? 'text-primary' : 'text-expense'
    },
    {
      title: 'This Month',
      amount: thisMonthIncome - thisMonthExpenses,
      icon: TrendingUp,
      gradient: (thisMonthIncome - thisMonthExpenses) >= 0 ? 'primary-gradient' : 'expense-gradient',
      textColor: (thisMonthIncome - thisMonthExpenses) >= 0 ? 'text-primary-foreground' : 'text-expense-foreground',
      bgColor: (thisMonthIncome - thisMonthExpenses) >= 0 ? 'bg-primary/10' : 'bg-expense/10',
      iconColor: (thisMonthIncome - thisMonthExpenses) >= 0 ? 'text-primary' : 'text-expense'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={card.title} className="card-gradient animate-slide-up hover:scale-105 transition-transform duration-200" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              card.title === 'Current Balance' && balance < 0 ? 'text-expense' :
              card.title === 'This Month' && (thisMonthIncome - thisMonthExpenses) < 0 ? 'text-expense' :
              card.title === 'Total Income' ? 'text-income' :
              card.title === 'Total Expenses' ? 'text-expense' : 'text-primary'
            }`}>
              {card.amount < 0 ? '-' : ''}${Math.abs(card.amount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.title === 'This Month' ? `Income: $${thisMonthIncome.toFixed(2)} | Expenses: $${thisMonthExpenses.toFixed(2)}` :
               card.title === 'Current Balance' ? (balance >= 0 ? 'Positive balance' : 'Deficit') :
               card.title === 'Total Income' ? `From ${transactions.filter(t => t.type === 'income').length} transactions` :
               `From ${transactions.filter(t => t.type === 'expense').length} transactions`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}