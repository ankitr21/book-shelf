import { Book, Post, ShelfStatus, User, UserBook } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Reader',
  handle: '@alexreads',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  bio: 'Sci-fi enthusiast and coffee lover. Currently lost in space operas.',
  stats: {
    reading: 2,
    completed: 45,
    wantToRead: 12,
  },
};

export const MOCK_FRIENDS: User[] = [
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    handle: '@sarahj',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    bio: 'Historical fiction addict.',
    stats: { reading: 1, completed: 120, wantToRead: 30 },
  },
  {
    id: 'u3',
    name: 'David Chen',
    handle: '@dchen_books',
    avatar: 'https://picsum.photos/seed/david/200/200',
    bio: 'Reading my way through the classics.',
    stats: { reading: 1, completed: 15, wantToRead: 50 },
  },
];

export const INITIAL_BOOKS: UserBook[] = [
  {
    id: 'b1',
    title: 'Project Hail Mary',
    authors: ['Andy Weir'],
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    thumbnail: 'https://books.google.com/books/content?id=zH4tEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    pageCount: 496,
    categories: ['Science Fiction'],
    publishedDate: '2021-05-04',
    status: ShelfStatus.READING,
    progress: 45,
    dateAdded: Date.now() - 1000000,
  },
  {
    id: 'b2',
    title: 'Dune',
    authors: ['Frank Herbert'],
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    thumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    pageCount: 412,
    categories: ['Science Fiction'],
    publishedDate: '1965-08-01',
    status: ShelfStatus.COMPLETED,
    progress: 100,
    rating: 5,
    dateAdded: Date.now() - 50000000,
  },
  {
    id: 'b3',
    title: 'The Midnight Library',
    authors: ['Matt Haig'],
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    thumbnail: 'https://books.google.com/books/content?id=548UEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    pageCount: 304,
    categories: ['Fiction'],
    publishedDate: '2020-08-13',
    status: ShelfStatus.WANT_TO_READ,
    progress: 0,
    dateAdded: Date.now() - 200000,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    user: MOCK_FRIENDS[0],
    content: 'Just finished "The Nightingale". Absolutely heartbreaking and beautiful. 5 stars!',
    timestamp: Date.now() - 3600000,
    likes: 12,
    comments: 3,
    type: 'REVIEW',
    book: {
        id: 'b4',
        title: 'The Nightingale',
        authors: ['Kristin Hannah'],
        thumbnail: 'https://books.google.com/books/content?id=KyxXAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    }
  },
  {
    id: 'p2',
    userId: 'u3',
    user: MOCK_FRIENDS[1],
    content: 'Starting my journey with "Moby Dick". Wish me luck!',
    timestamp: Date.now() - 86400000,
    likes: 8,
    comments: 5,
    type: 'UPDATE',
    book: {
        id: 'b5',
        title: 'Moby Dick',
        authors: ['Herman Melville'],
        thumbnail: 'https://books.google.com/books/content?id=JygQAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    }
  },
];
