import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseChart } from '@/components/ExpenseChart';
import { TransactionList } from '@/components/TransactionList';
import { FinancialSummary } from '@/components/FinancialSummary';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, BarChart3, List, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import heroImage from '@/assets/hero-finance.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'charts' | 'transactions'>('overview');
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const { transactions, loading: transactionsLoading, deleteTransaction } = useTransactions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || transactionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }


  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'add', label: 'Add Transaction', icon: Plus },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'transactions', label: 'History', icon: List },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold primary-gradient bg-clip-text text-transparent">
            SmartExpense
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user.email}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full primary-gradient glow-effect">
                <Wallet className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 primary-gradient bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track your expenses, analyze your spending patterns, and achieve your financial goals.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'financial'}
              onClick={() => setActiveTab(item.id as any)}
              className="flex items-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <FinancialSummary transactions={transactions} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ExpenseChart transactions={transactions} />
                </div>
                <div>
                  <TransactionList 
                    transactions={transactions.slice(0, 5)} 
                    onDeleteTransaction={deleteTransaction}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto">
              <ExpenseForm />
            </div>
          )}

          {activeTab === 'charts' && (
            <ExpenseChart transactions={transactions} />
          )}

          {activeTab === 'transactions' && (
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
