import React, { useState } from 'react';
import { Edit, UserX, UserCheck } from 'lucide-react';
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
import { toast } from 'sonner';

const mockUsers = [
  { id: '1', username: 'Admin', email: 'admin@tamcc.edu', role: 'admin', walletBalance: 0, active: true },
  { id: '2', username: 'johndoe', email: 'john@tamcc.edu', role: 'customer', walletBalance: 25.50, active: true },
  { id: '3', username: 'mariagarcia', email: 'maria@tamcc.edu', role: 'customer', walletBalance: 12.75, active: true },
  { id: '4', username: 'davidchen', email: 'david@tamcc.edu', role: 'customer', walletBalance: 40.00, active: true },
  { id: '5', username: 'sarahjohnson', email: 'sarah@tamcc.edu', role: 'customer', walletBalance: 8.25, active: false },
  { id: '6', username: 'michaelbrown', email: 'michael@tamcc.edu', role: 'customer', walletBalance: 15.00, active: true },
  { id: '7', username: 'emilydavis', email: 'emily@tamcc.edu', role: 'customer', walletBalance: 0, active: true },
  { id: '8', username: 'jameswilson', email: 'james@tamcc.edu', role: 'customer', walletBalance: 50.00, active: true },
];

export function ManageUsers() {
  const [users, setUsers] = useState(mockUsers);

  const handleToggleActive = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(`User ${user?.active ? 'deactivated' : 'activated'} successfully`);
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    customers: users.filter((u) => u.role === 'customer').length,
    active: users.filter((u) => u.active).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <p className="text-gray-600 mt-1">View and manage user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.admins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Customers</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.customers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold mt-1">{stats.active}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">#{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${user.walletBalance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(user.id)}
                          title={user.active ? 'Deactivate' : 'Activate'}
                        >
                          {user.active ? (
                            <UserX className="w-4 h-4 text-red-500" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
