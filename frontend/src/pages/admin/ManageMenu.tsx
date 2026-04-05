import React, { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
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
import { menuItems } from '../../data/menuData';
import { toast } from 'sonner';

export function ManageMenu() {
  const [items, setItems] = useState(menuItems);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setItems(items.filter((item) => item.id !== id));
      toast.success('Menu item deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Menu</h2>
          <p className="text-gray-600 mt-1">Add, edit, or remove menu items</p>
        </div>
        <Link to="/admin/menu/create">
          <Button className="bg-[#074af2] hover:bg-[#0639c0]">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Menu Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.options && item.options.length > 0 ? (
                        <span className="text-sm text-gray-600">
                          {item.options.length} option(s)
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/admin/menu/options/${item.id}`}>
                          <Button size="sm" variant="ghost" title="Manage Options">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/menu/edit/${item.id}`}>
                          <Button size="sm" variant="ghost" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
