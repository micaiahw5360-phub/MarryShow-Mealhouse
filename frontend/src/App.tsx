import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import PublicLayout from './components/layout/PublicLayout';   // from Figma
import AdminLayout from './components/layout/AdminLayout';     // from Figma
import { Login } from './pages/auth/Login';                    // correct path
import { Register } from './pages/auth/Register';              // correct path
import { Landing } from './pages/Home';                        // Home exports Landing
import { Menu } from './pages/Menu';                           // Menu exports Menu
import { MenuItemDetail } from './pages/MenuItemDetail';       // detail page
import { Cart } from './pages/Cart';                           // Cart page
import { Checkout } from './pages/Checkout';                   // Checkout page
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderHistory } from './pages/OrderHistory';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';                 // note: file name is Favourites.tsx? check
import { Notifications } from './pages/Notifications';
import { Help } from './pages/Help';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageMenu } from './pages/admin/ManageMenu';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageUsers } from './pages/admin/ManageUsers';
import { AddMenuItem } from './pages/admin/AddMenuItem';
import { EditMenuItem } from './pages/admin/EditMenuItem';
import { ManageItemOptions } from './pages/admin/ManageItemOptions';
import { NotFound } from './pages/NotFound';
import GlobalLoader from './components/GlobalLoader';           // optional

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
  console.error('App Error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <h1 className="text-red-600 text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-700 mb-4">{error.message}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reload Page
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <GlobalLoader />
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Landing />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<MenuItemDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="help" element={<Help />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="menu/create" element={<AddMenuItem />} />
              <Route path="menu/edit/:id" element={<EditMenuItem />} />
              <Route path="menu/options/:id" element={<ManageItemOptions />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;