import { useMutation, useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/api';
import { useCartStore } from '../context/cartStore';
import toast from 'react-hot-toast';

export const useCreateOrder = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const { items, totalPrice } = useCartStore();

  return useMutation({
    mutationFn: () =>
      ordersService.createOrder({
        items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total: totalPrice * 1.1, // with tax
      }),
    onSuccess: (data) => {
      clearCart();
      toast.success('Order placed successfully!');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
  });
};