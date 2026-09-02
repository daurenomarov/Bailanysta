import type { Database } from './types.js';

export const seed: Database = {
  users: [
    { id: 'u1', name: 'Айдана Серикова', username: 'aidana', bio: 'Продуктовый дизайнер из Алматы. Пишу о творчестве, городе и людях.', avatar: 'АС', followers: 1284, following: 236 },
    { id: 'u2', name: 'Данияр Ким', username: 'daniyar', bio: 'Frontend-разработчик и любитель гор.', avatar: 'ДК', followers: 842, following: 180 },
    { id: 'u3', name: 'Мадина Алимова', username: 'madina', bio: 'Фотографирую жизнь такой, какая она есть.', avatar: 'МА', followers: 2105, following: 419 }
  ],
  posts: [
    { id: 'p1', authorId: 'u2', text: 'Сегодня наконец запустил небольшой open-source проект. Иногда лучший способ научиться — просто начать делать. #разработка', createdAt: '2026-09-01T08:30:00.000Z', likes: 42, liked: false, comments: [] },
    { id: 'p2', authorId: 'u3', text: 'Утренний Алматы особенно красив, когда город ещё только просыпается. Кто тоже любит ранние прогулки? #алматы #город', createdAt: '2026-08-31T05:15:00.000Z', likes: 87, liked: false, comments: [{ id: 'c1', authorId: 'u1', text: 'Есть в этом особенная магия ✨', createdAt: '2026-08-31T06:00:00.000Z' }] },
    { id: 'p3', authorId: 'u1', text: 'Хороший дизайн начинается не с пикселей, а с внимательного разговора с людьми.', createdAt: '2026-08-30T13:45:00.000Z', likes: 64, liked: true, comments: [] }
  ]
};
