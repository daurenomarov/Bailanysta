import { FormEvent, useState } from 'react';
import { api } from '../api';
import type { Post } from '../types';
import { Avatar } from './Avatar';
export function Composer({ onCreated }: { onCreated: (post: Post) => void }) {
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(event: FormEvent) { event.preventDefault(); if (!text.trim()) return; setBusy(true); setError(''); try { const post = await api.createPost(text); onCreated(post); setText(''); } catch (e) { setError(e instanceof Error ? e.message : 'Ошибка публикации'); } finally { setBusy(false); } }
  return <form className="card composer" onSubmit={submit}><Avatar initials="АС"/><div><textarea value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="Поделитесь чем-нибудь…" aria-label="Текст новой публикации"/><div className="composer-actions"><small>{text.length}/500</small><button className="primary" disabled={busy || !text.trim()}>{busy ? 'Публикуем…' : 'Опубликовать'}</button></div>{error && <p className="error">{error}</p>}</div></form>;
}
