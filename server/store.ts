import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { seed } from './seed.js';
import type { Database, StoredPost } from './types.js';

const defaultPath = path.resolve('data/db.json');

export class Store {
  constructor(private readonly filePath = defaultPath) {}

  async read(): Promise<Database> {
    try { return JSON.parse(await readFile(this.filePath, 'utf8')) as Database; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      await this.write(structuredClone(seed));
      return structuredClone(seed);
    }
  }

  async write(data: Database) {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async updatePost(id: string, change: (post: StoredPost) => void) {
    const db = await this.read();
    const post = db.posts.find((item) => item.id === id);
    if (!post) return null;
    change(post);
    await this.write(db);
    return { db, post };
  }
}
