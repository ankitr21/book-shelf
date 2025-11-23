export enum ShelfStatus {
  READING = 'Reading',
  COMPLETED = 'Completed',
  WANT_TO_READ = 'Want to Read',
  OWNED = 'Owned',
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  pageCount?: number;
  categories?: string[];
  publishedDate?: string;
  isbn?: string;
}

export interface UserBook extends Book {
  status: ShelfStatus;
  progress: number; // 0 to 100
  rating?: number; // 1 to 5
  notes?: string;
  dateAdded: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  stats: {
    reading: number;
    completed: number;
    wantToRead: number;
  };
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  book?: Book;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  type: 'UPDATE' | 'REVIEW' | 'ADD';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'FRIEND_REQUEST' | 'LIKE' | 'COMMENT';
}
