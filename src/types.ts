export interface User { id: string; name: string; username: string; bio: string; avatar: string; followers: number; following: number }
export interface Comment { id: string; author: User; text: string; createdAt: string }
export interface Post { id: string; author: User; text: string; createdAt: string; likes: number; liked: boolean; comments: Comment[] }
