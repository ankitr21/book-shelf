import React, { useState } from 'react';
import { UserBook, ShelfStatus } from '../types';
import { BookCard } from './BookCard';
import { Filter, ChevronDown } from 'lucide-react';

interface BookshelfProps {
  books: UserBook[];
  onUpdateStatus: (id: string, status: ShelfStatus) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ books, onUpdateStatus }) => {
  const [filter, setFilter] = useState<ShelfStatus | 'All'>('All');

  const filteredBooks = filter === 'All' 
    ? books 
    : books.filter(b => b.status === filter);

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === ShelfStatus.READING).length,
    completed: books.filter(b => b.status === ShelfStatus.COMPLETED).length,
    want: books.filter(b => b.status === ShelfStatus.WANT_TO_READ).length,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 pb-24">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-ink mb-2">My Shelf</h2>
          <p className="text-stone-500 font-medium">Your personal library and reading history.</p>
        </div>
        
        {/* Stats Row */}
        <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center min-w-[90px]">
                <span className="text-2xl font-bold text-accent leading-none mb-1">{stats.reading}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Active</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center min-w-[90px]">
                <span className="text-2xl font-bold text-ink leading-none mb-1">{stats.completed}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Read</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center min-w-[90px]">
                <span className="text-2xl font-bold text-ink leading-none mb-1">{stats.want}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Queued</span>
            </div>
        </div>
      </header>

      {/* Custom Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
        {['All', ...Object.values(ShelfStatus)].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              filter === status
                ? 'bg-ink text-white shadow-lg transform scale-105'
                : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 min-h-[400px]">
        {filteredBooks.map((book) => (
          <div key={book.id} className="animate-fade-in-up">
            <BookCard 
                book={book} 
                onStatusChange={onUpdateStatus}
                isOwner={true}
            />
          </div>
        ))}
      </div>
      
      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 mb-4">
            <Filter size={24} />
          </div>
          <p className="text-stone-400 font-medium">Your shelf looks a bit empty here.</p>
          <button className="mt-4 text-accent font-bold text-sm hover:underline">Find books to add</button>
        </div>
      )}
    </div>
  );
};