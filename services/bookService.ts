import { Book } from '../types';

export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title,
        authors: info.authors || ['Unknown Author'],
        description: info.description,
        thumbnail: info.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
        pageCount: info.pageCount,
        categories: info.categories,
        publishedDate: info.publishedDate,
        isbn: info.industryIdentifiers?.[0]?.identifier,
      };
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
