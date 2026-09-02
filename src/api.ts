import type { Post, User } from './types';
const base = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? 'Не удалось выполнить запрос'); }
  return response.json() as Promise<T>;
}
export const api = {
  posts: (query = '') => request<Post[]>(`/api/posts${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  user: (id: string) => request<User>(`/api/users/${id}`),
  userPosts: (id: string) => request<Post[]>(`/api/users/${id}/posts`),
  createPost: (text: string) => request<Post>('/api/posts', { method: 'POST', body: JSON.stringify({ authorId: 'u1', text }) }),
  editPost: (id: string, text: string) => request<Post>(`/api/posts/${id}`, { method: 'PATCH', body: JSON.stringify({ text }) }),
  like: (id: string) => request<Post>(`/api/posts/${id}/like`, { method: 'POST' }),
  comment: (id: string, text: string) => request<Post>(`/api/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
};
