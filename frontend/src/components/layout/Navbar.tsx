import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { useCartStore } from '../../context/cartStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          🍽️ MarryShow Mealhouse
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/menu" className="text-gray-700 hover:text-primary-600 transition">
            Menu
          </Link>
          <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition">
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                💰 ${user.wallet_balance?.toFixed(2)}
              </span>
              <span className="text-gray-700">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Staff Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}