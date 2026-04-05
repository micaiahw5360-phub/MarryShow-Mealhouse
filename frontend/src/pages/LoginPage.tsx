import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Phase 6 - Replace with actual API call to /api/login
    // Mock login: accept any name/password for now
    setTimeout(() => {
      // Mock user data
      const mockUser = {
        id: 1,
        name: name,
        email: `${name}@university.edu`,
        role: 'staff' as const,
        wallet_balance: 150.00,
      };
      const mockToken = 'mock-jwt-token';
      login(mockUser, mockToken);
      toast.success(`Welcome back, ${name}!`);
      navigate('/');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Staff Login</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" isLoading={isLoading} fullWidth>
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}