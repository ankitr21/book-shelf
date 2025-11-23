import React from 'react';
import { Book, ShelfStatus, UserBook } from '../types';
import { PlayCircle, CheckCircle, PlusCircle, Star } from 'lucide-react';

interface BookCardProps {
  book: Book | UserBook;
  onStatusChange?: (id: string, status: ShelfStatus) => void;
  isOwner?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onStatusChange, isOwner = false }) => {
  const isUserBook = (b: Book | UserBook): b is UserBook => {
    return (b as UserBook).status !== undefined;
  };

  const renderProgressBar = () => {
    if (isUserBook(book) && book.status === ShelfStatus.READING) {
      return (
        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-accent h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(217,119,6,0.4)]" 
            style={{ width: `${book.progress}%` }}
          ></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group relative flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[2/3] w-full mb-4 rounded-xl overflow-hidden bg-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
        {book.thumbnail ? (
          <img 
            src={book.thumbnail} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 p-4 text-center bg-stone-50">
            <span className="font-serif italic opacity-50">No Cover</span>
          </div>
        )}
        
        {/* Hover Actions Overlay - Glassmorphism */}
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
           {onStatusChange && (
             <>
               <button 
                onClick={() => onStatusChange(book.id, ShelfStatus.READING)}
                className="p-3 bg-white rounded-full text-ink hover:text-accent hover:scale-110 transition-all shadow-lg" title="Start Reading">
                 <PlayCircle size={22} fill="currentColor" className="text-white" strokeWidth={1.5}/>
               </button>
               <button 
                onClick={() => onStatusChange(book.id, ShelfStatus.COMPLETED)}
                className="p-3 bg-white rounded-full text-ink hover:text-green-600 hover:scale-110 transition-all shadow-lg" title="Mark as Done">
                 <CheckCircle size={22} />
               </button>
               <button 
                onClick={() => onStatusChange(book.id, ShelfStatus.WANT_TO_READ)}
                className="p-3 bg-white rounded-full text-ink hover:text-blue-600 hover:scale-110 transition-all shadow-lg" title="Want to Read">
                 <PlusCircle size={22} />
               </button>
             </>
           )}
        </div>

        {/* Status Badge */}
        {isUserBook(book) && (
            <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
                book.status === ShelfStatus.READING ? 'bg-accent/90' :
                book.status === ShelfStatus.COMPLETED ? 'bg-green-600/90' :
                'bg-stone-800/80'
            }`}>
                {book.status === ShelfStatus.READING ? `${book.progress}%` : book.status === ShelfStatus.WANT_TO_READ ? 'To Read' : 'Done'}
            </div>
        )}
      </div>

      <div className="flex-1 px-1">
        <h3 className="font-serif font-bold text-ink text-base line-clamp-2 leading-[1.3] mb-1 group-hover:text-accent transition-colors">{book.title}</h3>
        <p className="text-stone-500 text-xs font-medium mb-2 line-clamp-1">{book.authors.join(', ')}</p>
        
        {isUserBook(book) && book.rating && (
            <div className="flex text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < book.rating! ? "currentColor" : "none"} className={i < book.rating! ? "" : "text-stone-200"} />
                ))}
            </div>
        )}
        
        {renderProgressBar()}
      </div>
    </div>
  );
};