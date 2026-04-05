import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Wallet as WalletIcon, Plus, ArrowLeft, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
}

export function Wallet() {
  const { user, updateWalletBalance } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('wallet-transactions');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        date: '2026-03-25',
        type: 'credit',
        amount: 25.0,
        description: 'Wallet Top-up',
      },
      {
        id: '2',
        date: '2026-03-24',
        type: 'debit',
        amount: 12.5,
        description: 'Order #ORD-1234',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wallet-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount < 5) {
      toast.error('Minimum top-up amount is $5');
      return;
    }
    if (amount > 500) {
      toast.error('Maximum top-up amount is $500');
      return;
    }

    updateWalletBalance(amount);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'credit',
      amount,
      description: 'Wallet Top-up',
    };
    setTransactions([newTransaction, ...transactions]);

    addNotification({
      type: 'system',
      title: 'Wallet Topped Up',
      message: `$${amount.toFixed(2)} has been added to your wallet. Your new balance is $${(user!.walletBalance + amount).toFixed(2)}.`,
    });

    toast.success(`Added $${amount.toFixed(2)} to your wallet!`);
    setTopUpAmount('');
  };

  const quickAmounts = [10, 25, 50, 100];

  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to access your wallet.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your TAMCC Deli wallet balance and transactions</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-[#074af2] to-[#0639c0] text-white">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <WalletIcon className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">TAMCC Wallet Balance</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/20">
                Active
              </Badge>
            </div>
            <p className="text-5xl font-bold mb-6">${user.walletBalance.toFixed(2)}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs opacity-90">Total Added</span>
                </div>
                <p className="text-xl font-bold">${totalCredits.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs opacity-90">Total Spent</span>
                </div>
                <p className="text-xl font-bold">${totalDebits.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="topup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topup">Top Up</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="topup">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds to Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Enter Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="pl-8"
                      min="5"
                      max="500"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Minimum: $5 | Maximum: $500</p>
                </div>

                <div className="space-y-2">
                  <Label>Quick amounts</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setTopUpAmount(amount.toString())}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Payment Method</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                  </div>
                </div>

                <Button onClick={handleTopUp} className="w-full h-12" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add ${topUpAmount || '0.00'} to Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.type === 'credit' ? 'default' : 'secondary'}
                              className={
                                transaction.type === 'credit'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}$
                            {transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}