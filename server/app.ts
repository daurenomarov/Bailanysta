import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Store } from './store.js';
import type { Database, StoredPost } from './types.js';

const cleanText = (value: unknown, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const presentPost = (post: StoredPost, db: Database) => ({ ...post, author: db.users.find((u) => u.id === post.authorId), comments: post.comments.map((c) => ({ ...c, author: db.users.find((u) => u.id === c.authorId) })) });

export function createApp(store = new Store()) {
  const app = express();
  app.use(cors()); app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/api/users/:id', async (req, res) => {
    const db = await store.read(); const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  });
  app.get('/api/posts', async (req, res) => {
    const db = await store.read(); const query = cleanText(req.query.q, 80).toLowerCase();
    const posts = db.posts.filter((p) => !query || p.text.toLowerCase().includes(query)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(posts.map((p) => presentPost(p, db)));
  });
  app.get('/api/users/:id/posts', async (req, res) => {
    const db = await store.read();
    if (!db.users.some((u) => u.id === req.params.id)) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(db.posts.filter((p) => p.authorId === req.params.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((p) => presentPost(p, db)));
  });
  app.post('/api/posts', async (req, res) => {
    const text = cleanText(req.body?.text); const authorId = cleanText(req.body?.authorId, 50); const db = await store.read();
    if (!text) return res.status(400).json({ message: 'Текст публикации обязателен' });
    if (!db.users.some((u) => u.id === authorId)) return res.status(400).json({ message: 'Некорректный автор' });
    const post: StoredPost = { id: randomUUID(), authorId, text, createdAt: new Date().toISOString(), likes: 0, liked: false, comments: [] };
    db.posts.push(post); await store.write(db); res.status(201).json(presentPost(post, db));
  });
  app.patch('/api/posts/:id', async (req, res) => {
    const text = cleanText(req.body?.text);
    if (!text) return res.status(400).json({ message: 'Текст публикации обязателен' });
    const result = await store.updatePost(req.params.id, (post) => { if (post.authorId === 'u1') post.text = text; });
    if (!result) return res.status(404).json({ message: 'Публикация не найдена' });
    if (result.post.authorId !== 'u1') return res.status(403).json({ message: 'Можно редактировать только свои публикации' });
    res.json(presentPost(result.post, result.db));
  });
  app.post('/api/posts/:id/like', async (req, res) => {
    const result = await store.updatePost(req.params.id, (post) => { post.liked = !post.liked; post.likes += post.liked ? 1 : -1; });
    if (!result) return res.status(404).json({ message: 'Публикация не найдена' });
    res.json(presentPost(result.post, result.db));
  });
  app.post('/api/posts/:id/comments', async (req, res) => {
    const text = cleanText(req.body?.text, 240);
    if (!text) return res.status(400).json({ message: 'Текст комментария обязателен' });
    const result = await store.updatePost(req.params.id, (post) => post.comments.push({ id: randomUUID(), authorId: 'u1', text, createdAt: new Date().toISOString() }));
    if (!result) return res.status(404).json({ message: 'Публикация не найдена' });
    res.status(201).json(presentPost(result.post, result.db));
  });

  app.use('/api', (_req, res) => res.status(404).json({ message: 'API endpoint не найден' }));

  const dist = path.resolve('dist'); app.use(express.static(dist));
  app.get('*path', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (typeof _next === 'function') { /* No-op to satisfy strict linters */ }
  console.error(error);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});


  return app;
}
