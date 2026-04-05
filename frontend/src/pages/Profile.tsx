import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '473-555-0123',
    address: 'TAMCC Campus, St. George\'s, Grenada',
    studentId: 'TC123456',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSavePassword = () => {
    toast.success('Password changed successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and student information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-[#074af2] flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Campus Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePassword} className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="order-updates" className="font-medium">Order Updates</Label>
                    </div>
                    <p className="text-sm text-gray-500">Receive notifications about your order status</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="promotions" className="font-medium">Promotions & Deals</Label>
                    </div>
                    <p className="text-sm text-gray-500">Get notified about special offers and discounts</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="newsletter" className="font-medium">Newsletter</Label>
                    </div>
                    <p className="text-sm text-gray-500">Receive our monthly newsletter with menu updates</p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Visa •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>

                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Mastercard •••• 8888</p>
                      <p className="text-sm text-gray-500">Expires 08/27</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                + Add Payment Method
              </Button>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">TAMCC Wallet Balance</h4>
                <p className="text-2xl font-bold text-blue-900 mb-2">$45.50</p>
                <Button size="sm" variant="outline">Add Funds</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
