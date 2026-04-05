import React, { useState } from 'react';
import { Eye } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

const mockOrders = [
  { id: 'ORD-1245', customer: 'John Smith', email: 'john@example.com', date: '2026-03-26 10:30', total: 15.99, status: 'pending', items: 3 },
  { id: 'ORD-1244', customer: 'Maria Garcia', email: 'maria@example.com', date: '2026-03-26 10:15', total: 23.50, status: 'preparing', items: 5 },
  { id: 'ORD-1243', customer: 'David Chen', email: 'david@example.com', date: '2026-03-26 09:45', total: 12.99, status: 'ready', items: 2 },
  { id: 'ORD-1242', customer: 'Sarah Johnson', email: 'sarah@example.com', date: '2026-03-26 09:30', total: 18.75, status: 'completed', items: 4 },
  { id: 'ORD-1241', customer: 'Michael Brown', email: 'michael@example.com', date: '2026-03-26 09:00', total: 31.20, status: 'completed', items: 6 },
  { id: 'ORD-1240', customer: 'Emily Davis', email: 'emily@example.com', date: '2026-03-25 15:45', total: 9.99, status: 'completed', items: 1 },
  { id: 'ORD-1239', customer: 'James Wilson', email: 'james@example.com', date: '2026-03-25 14:20', total: 27.50, status: 'completed', items: 5 },
  { id: 'ORD-1238', customer: 'Lisa Anderson', email: 'lisa@example.com', date: '2026-03-25 13:10', total: 16.99, status: 'completed', items: 3 },
];

export function ManageOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success('Order status updated');
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <p className="text-gray-600 mt-1">View and update order statuses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Preparing</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.preparing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Ready</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.ready}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold mt-1 text-gray-600">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Filter:</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.date}</TableCell>
                    <TableCell className="text-sm">{order.items} items</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className={`w-[130px] ${getStatusColor(order.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
