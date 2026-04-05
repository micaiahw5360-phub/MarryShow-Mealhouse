const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/MarryShow-Mealhouse/backend/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('tamcc_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { headers, ...options });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const authService = {
  login: (email: string, password: string) =>
    fetchAPI<{ user: any; token: string }>('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username: string, email: string, password: string) =>
    fetchAPI<{ user: any; token: string }>('/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
};

export const itemsService = {
  getItems: (category?: string) =>
    fetchAPI<any[]>(category ? `/items?category=${encodeURIComponent(category)}` : '/items'),
  getItem: (id: number) => fetchAPI<any>(`/items/${id}`),
  getCategories: () => fetchAPI<string[]>('/categories'),
};

export const ordersService = {
  createOrder: (data: { items: any[]; total: number; paymentMethod: string; pickupTime?: string }) =>
    fetchAPI<{ orderId: number }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => fetchAPI<any[]>('/orders'),
  getOrder: (id: number) => fetchAPI<any>(`/orders/${id}`),
};

export const walletService = {
  getBalance: () => fetchAPI<{ balance: number }>('/wallet'),
  topUp: (amount: number) =>
    fetchAPI<{ newBalance: number }>('/wallet/topup', { method: 'POST', body: JSON.stringify({ amount }) }),
};

export const favoritesService = {
  getFavorites: () => fetchAPI<{ menu_item_id: number }[]>('/favorites'),
  addFavorite: (menuItemId: number) =>
    fetchAPI('/favorites', { method: 'POST', body: JSON.stringify({ menu_item_id: menuItemId }) }),
  removeFavorite: (menuItemId: number) =>
    fetchAPI(`/favorites/${menuItemId}`, { method: 'DELETE' }),
};

export const notificationsService = {
  getNotifications: () => fetchAPI<any[]>('/notifications'),
  markAsRead: (id: number) =>
    fetchAPI(`/notifications/${id}/read`, { method: 'POST' }),
  deleteNotification: (id: number) =>
    fetchAPI(`/notifications/${id}`, { method: 'DELETE' }),
};

export const userService = {
  updateProfile: (data: { username?: string; email?: string; phone?: string; address?: string; student_id?: string }) =>
    fetchAPI('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (oldPassword: string, newPassword: string) =>
    fetchAPI('/profile/password', { method: 'PUT', body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }) }),
};