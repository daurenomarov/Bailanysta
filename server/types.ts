export interface StoredUser { id: string; name: string; username: string; bio: string; avatar: string; followers: number; following: number }
export interface StoredComment { id: string; authorId: string; text: string; createdAt: string }
export interface StoredPost { id: string; authorId: string; text: string; createdAt: string; likes: number; liked: boolean; comments: StoredComment[] }
export interface Database { users: StoredUser[]; posts: StoredPost[] }
