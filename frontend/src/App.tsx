import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import MainLayout from './components/layout/PublicLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/Home';
import MenuPage from './pages/Menu';
import CartPage from './pages/Cart';
import PaymentPage from './pages/Payment';
import ConfirmationPage from './pages/OrderConfirmation';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';

const queryClient = new QueryClient();

// Fallback component for errors
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
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;