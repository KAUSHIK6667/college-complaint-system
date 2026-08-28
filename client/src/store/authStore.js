import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

export const useAuthStore = create(persist((set) => ({
  user: null,
  token: null,
  loading: false,
  async login(credentials) { set({ loading: true }); const { data } = await api.post('/auth/login', credentials); localStorage.setItem('edufix-token', data.token); set({ ...data, loading: false }); },
  async register(payload) { set({ loading: true }); const { data } = await api.post('/auth/register', payload); localStorage.setItem('edufix-token', data.token); set({ ...data, loading: false }); },
  logout() { localStorage.removeItem('edufix-token'); set({ user: null, token: null }); }
}), { name: 'edufix-session', partialize: (state) => ({ user: state.user, token: state.token }) }));
