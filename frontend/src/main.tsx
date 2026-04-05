import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { KioskProvider } from './contexts/KioskContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <KioskProvider>
          <FavoritesProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </FavoritesProvider>
        </KioskProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);