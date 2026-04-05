import React, { useState } from 'react';
import { Link } from 'react-router';
import { RefreshCw, ShoppingBag, Users, UtensilsCrossed, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const weeklySalesData = [
  { day: 'Mon', sales: 450 },
  { day: 'Tue', sales: 520 },
  { day: 'Wed', sales: 680 },
  { day: 'Thu', sales: 590 },
  { day: 'Fri', sales: 820 },
  { day: 'Sat', sales: 380 },
  { day: 'Sun', sales: 0 },
];

const popularItemsData = [
  { name: 'Breakfast Sandwich', orders: 145 },
  { name: 'Burger Combo', orders: 128 },
  { name: 'Caribbean Bowl', orders: 112 },
  { name: 'Pizza Slice', orders: 98 },
  { name: 'Club Sandwich', orders: 85 },
];

const recentOrders = [
  { id: 'ORD-1245', customer: 'John Smith', date: '2026-03-26 10:30 AM', total: 15.99, status: 'pending' },
  { id: 'ORD-1244', customer: 'Maria Garcia', date: '2026-03-26 10:15 AM', total: 23.50, status: 'preparing' },
  { id: 'ORD-1243', customer: 'David Chen', date: '2026-03-26 09:45 AM', total: 12.99, status: 'ready' },
  { id: 'ORD-1242', customer: 'Sarah Johnson', date: '2026-03-26 09:30 AM', total: 18.75, status: 'completed' },
  { id: 'ORD-1241', customer: 'Michael Brown', date: '2026-03-26 09:00 AM', total: 31.20, status: 'completed' },
];

export function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold mt-2">1,245</p>
                <p className="text-sm text-green-600 mt-1">+12% from last week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#074af2]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold mt-2">8</p>
                <p className="text-sm text-gray-500 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#f97316]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold mt-2">342</p>
                <p className="text-sm text-green-600 mt-1">+5 new this week</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menu Items</p>
                <p className="text-3xl font-bold mt-2">12</p>
                <p className="text-sm text-gray-500 mt-1">Active items</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Sales</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [`$${value}`, 'Sales']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#074af2"
                  strokeWidth={2}
                  dot={{ fill: '#074af2', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Items Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Popular Items</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularItemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [`${value} orders`, 'Orders']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/admin/orders">
              <Button size="sm" variant="outline">
                View All Orders
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-sm text-gray-600">{order.date}</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/menu/create">
              <Button variant="outline" className="w-full justify-start">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
