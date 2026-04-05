import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'A La Carte' | 'Combo' | 'Beverage' | 'Dessert';
  price: number;
  image: string;
  description: string;
  options?: ItemOption[];
}

export interface ItemOption {
  id: string;
  name: string;
  values: OptionValue[];
}

export interface OptionValue {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: { [optionId: string]: OptionValue };
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, options: { [optionId: string]: OptionValue }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('tamcc_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tamcc_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem: MenuItem, selectedOptions: { [optionId: string]: OptionValue }) => {
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.priceModifier,
      0
    );
    const subtotal = menuItem.price + optionsPrice;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      menuItem,
      quantity: 1,
      selectedOptions,
      subtotal,
    };

    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity, subtotal: (item.menuItem.price + 
              Object.values(item.selectedOptions).reduce((sum, opt) => sum + opt.priceModifier, 0)
            ) * quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
