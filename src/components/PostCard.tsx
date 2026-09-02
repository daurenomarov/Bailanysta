import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Post } from '../types';
import { Avatar } from './Avatar';
const date = (value: string) => new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function PostCard({ post, onChange }: { post: Post; onChange: (post: Post) => void }) {
  const [comment, setComment] = useState(''); const [showComments, setShowComments] = useState(false); const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(post.text); const [busy, setBusy] = useState(false);
  async function act(task: () => Promise<Post>) { setBusy(true); try { onChange(await task()); } finally { setBusy(false); } }
  async function addComment(e: FormEvent) { e.preventDefault(); if (!comment.trim()) return; await act(() => api.comment(post.id, comment)); setComment(''); }
  async function save(e: FormEvent) { e.preventDefault(); if (!draft.trim()) return; await act(() => api.editPost(post.id, draft)); setEditing(false); }
  return <article className="card post"><div className="post-head"><Link to={`/profile/${post.author.id}`}><Avatar initials={post.author.avatar}/></Link><div><Link className="author" to={`/profile/${post.author.id}`}>{post.author.name}</Link><span className="meta">@{post.author.username} · {date(post.createdAt)}</span></div>{post.author.id === 'u1' && <button className="quiet edit" onClick={() => setEditing(!editing)}>Редактировать</button>}</div>{editing ? <form onSubmit={save}><textarea className="edit-area" value={draft} maxLength={500} onChange={(e) => setDraft(e.target.value)}/><button className="primary" disabled={busy}>Сохранить</button></form> : <p className="post-text">{post.text}</p>}<div className="post-actions"><button className={post.liked ? 'liked' : ''} disabled={busy} onClick={() => void act(() => api.like(post.id))}>♡ <span>{post.likes}</span></button><button onClick={() => setShowComments(!showComments)}>◯ <span>{post.comments.length}</span></button></div>{showComments && <div className="comments">{post.comments.map((item) => <div className="comment" key={item.id}><Avatar initials={item.author.avatar}/><p><b>{item.author.name}</b> {item.text}</p></div>)}{!post.comments.length && <p className="muted">Комментариев пока нет.</p>}<form onSubmit={addComment}><input value={comment} maxLength={240} onChange={(e) => setComment(e.target.value)} placeholder="Написать комментарий…"/><button className="quiet" disabled={busy || !comment.trim()}>Отправить</button></form></div>}</article>;
}
