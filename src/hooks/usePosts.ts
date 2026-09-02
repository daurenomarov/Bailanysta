import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { Post } from '../types';

export function usePosts(userId?: string, query = '') {
  const [posts, setPosts] = useState<Post[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setPosts(userId ? await api.userPosts(userId) : await api.posts(query)); } catch (e) { setError(e instanceof Error ? e.message : 'Ошибка загрузки'); } finally { setLoading(false); } }, [userId, query]);
  useEffect(() => { void load(); }, [load]);
  const replace = (post: Post) => setPosts((items) => items.map((item) => item.id === post.id ? post : item));
  return { posts, setPosts, replace, loading, error, retry: load };
}
