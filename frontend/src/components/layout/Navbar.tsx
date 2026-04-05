import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useCategories } from '../../hooks/useMenuData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Home,
  Menu as MenuIcon,
  ShoppingCart,
  Wallet,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { data: categories, isLoading } = useCategories();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span className="hidden sm:inline">MarryShow Mealhouse</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <MenuIcon className="h-4 w-4" />
                Menu
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/menu">All Items</Link>
              </DropdownMenuItem>
              {!isLoading && categories?.map((cat) => (
                <DropdownMenuItem key={cat} asChild>
                  <Link to={`/menu?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Link to="/wallet" className="text-gray-700 hover:text-primary-600">
            <Wallet className="h-5 w-5" />
          </Link>

          <Link to="/profile" className="text-gray-700 hover:text-primary-600">
            <LayoutDashboard className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                ${user.walletBalance?.toFixed(2)}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile simplified */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute -top-2 -right-4 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
          </Link>
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}