const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Generic fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

// Auth services
export const authService = {
  login: (name: string, password: string) =>
    fetchAPI<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    }),
  logout: () => fetchAPI('/logout', { method: 'POST' }),
};

// Items services
export const itemsService = {
  getCategories: () => fetchAPI<Category[]>('/categories'),
  getItems: (categoryId?: number) =>
    fetchAPI<MenuItem[]>(categoryId ? `/items?category=${categoryId}` : '/items'),
  getItem: (id: number) => fetchAPI<MenuItem>(`/items/${id}`),
};

// Orders services
export const ordersService = {
  createOrder: (data: { items: CartItem[]; total: number }) =>
    fetchAPI<{ orderId: number; receipt: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrder: (id: number) => fetchAPI<Order>(`/orders/${id}`),
};

// Wallet services
export const walletService = {
  getBalance: () => fetchAPI<{ balance: number }>('/wallet'),
  deduct: (amount: number) =>
    fetchAPI<{ newBalance: number }>('/wallet/deduct', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};