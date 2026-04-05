import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.id === newItem.id);
        let updatedItems;
        if (existing) {
          updatedItems = items.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
          );
        } else {
          updatedItems = [...items, newItem];
        }
        const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ items: updatedItems, totalItems, totalPrice });
      },
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, totalItems, totalPrice };
        });
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== itemId);
            const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
            const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
            return { items: newItems, totalItems, totalPrice };
          }
          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          );
          const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, totalItems, totalPrice };
        });
      },
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
      totalItems: 0,
      totalPrice: 0,
    }),
    { name: 'cart-storage' }
  )
);