import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../context/authStore';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: ({ name, password }: { name: string; password: string }) =>
      authService.login(name, password),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      toast.success('Logged out');
    },
    onError: () => {
      // Still clear local state even if API fails
      logout();
      toast.error('Logout error, but cleared session');
    },
  });
}