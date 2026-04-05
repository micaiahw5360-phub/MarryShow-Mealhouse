import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, User, Menu as MenuIcon, Wallet, LogOut, Heart, Bell, History, HelpCircle, MessageSquare, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useKiosk } from '../contexts/KioskContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function PublicLayout() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { isKioskMode } = useKiosk();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Promo Banner */}
      {!isKioskMode && <PromoBanner />}

      {/* Header */}
      {!isKioskMode && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#074af2] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-gray-900">TAMCC Deli</div>
                  <div className="text-xs text-gray-500">Marryshow Mealhouse</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-[#074af2] transition-colors">
                  Home
                </Link>
                <Link to="/menu" className="text-gray-700 hover:text-[#074af2] transition-colors">
                  Menu
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-[#074af2] transition-colors">
                  About
                </Link>
                <Link to="/help" className="text-gray-700 hover:text-[#074af2] transition-colors">
                  Help
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-[#074af2] transition-colors">
                  Contact
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                {user && (
                  <Link to="/notifications">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                {/* Cart */}
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        <History className="mr-2 h-4 w-4" />
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/favorites')}>
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/notifications')}>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/wallet')}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet (${user.walletBalance.toFixed(2)})
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin')}>
                            Admin Dashboard
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button size="sm">Sign In</Button>
                  </Link>
                )}

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden pb-4">
                <nav className="flex flex-col space-y-2">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-[#074af2] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/menu"
                    className="text-gray-700 hover:text-[#074af2] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Menu
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-[#074af2] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/help"
                    className="text-gray-700 hover:text-[#074af2] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-[#074af2] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/profile"
                        className="text-gray-700 hover:text-[#074af2] py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="text-gray-700 hover:text-[#074af2] py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Order History
                      </Link>
                      <Link
                        to="/favorites"
                        className="text-gray-700 hover:text-[#074af2] py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      <Link
                        to="/notifications"
                        className="text-gray-700 hover:text-[#074af2] py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Notifications
                      </Link>
                      <Link
                        to="/wallet"
                        className="text-gray-700 hover:text-[#074af2] py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Wallet
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Kiosk Mode Header */}
      {isKioskMode && (
        <header className="bg-[#074af2] text-white py-4 border-4 border-[#f97316]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#074af2] font-bold text-xl">T</span>
              </div>
              <div>
                <div className="font-bold text-xl">TAMCC Deli - Kiosk</div>
                <div className="text-sm text-white/80">Touch to Order</div>
              </div>
            </div>
            <Link to="/cart">
              <Button size="lg" variant="secondary" className="relative">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-sm rounded-full w-7 h-7 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {!isKioskMode && (
        <footer className="bg-gray-900 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="font-bold text-lg mb-2">TAMCC Deli</div>
                <p className="text-gray-400 text-sm">
                  T.A. Marryshow Community College Cafeteria
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">Quick Links</div>
                <div className="space-y-1">
                  <Link to="/menu" className="block text-gray-400 hover:text-white text-sm">
                    Menu
                  </Link>
                  <Link to="/about" className="block text-gray-400 hover:text-white text-sm">
                    About Us
                  </Link>
                  <Link to="/help" className="block text-gray-400 hover:text-white text-sm">
                    Help Center
                  </Link>
                  <Link to="/contact" className="block text-gray-400 hover:text-white text-sm">
                    Contact
                  </Link>
                  {user && (
                    <>
                      <Link to="/orders" className="block text-gray-400 hover:text-white text-sm">
                        Order History
                      </Link>
                      <Link to="/favorites" className="block text-gray-400 hover:text-white text-sm">
                        Favorites
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Contact</div>
                <p className="text-gray-400 text-sm">Main Campus Cafeteria</p>
                <p className="text-gray-400 text-sm">St. George's, Grenada</p>
                <p className="text-gray-400 text-sm">deli@tamcc.edu.gd</p>
                <p className="text-gray-400 text-sm">473-440-2000</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              © 2026 TAMCC Deli. All rights reserved.
            </div>
          </div>
        </footer>
      )}

      {/* Kiosk Floating Cart Button */}
      {isKioskMode && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 bg-[#f97316] text-white rounded-full p-4 shadow-lg hover:bg-[#ea580c] transition-colors"
        >
          <ShoppingCart className="w-8 h-8" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#074af2] text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
