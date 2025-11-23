import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Plus, ArrowRight } from 'lucide-react';
import { searchBooks } from '../services/bookService';
import { getBookRecommendations } from '../services/geminiService';
import { Book, ShelfStatus, UserBook } from '../types';
import { BookCard } from './BookCard';

interface ExploreProps {
  currentBooks: UserBook[];
  onAddBook: (book: Book, status: ShelfStatus) => void;
}

export const Explore: React.FC<ExploreProps> = ({ currentBooks, onAddBook }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'search' | 'ai'>('search');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReason, setAiReason] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResults([]);
    const books = await searchBooks(query);
    setResults(books);
    setLoading(false);
  };

  const handleAiRecommend = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setResults([]);
    setAiReason('');
    const { recommendations, reason } = await getBookRecommendations(aiPrompt, currentBooks);
    setResults(recommendations);
    setAiReason(reason);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 pb-24">
      <header className="mb-10">
        <h2 className="text-4xl font-serif font-bold text-ink mb-2">Explore</h2>
        <p className="text-stone-500 font-medium">Curate your next great adventure.</p>
      </header>

      {/* Hero / Tool Selection */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <button
          onClick={() => { setMode('search'); setResults([]); setAiReason(''); }}
          className={`flex-1 p-6 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group ${
            mode === 'search' 
              ? 'bg-white border-accent/20 shadow-lg shadow-accent/5' 
              : 'bg-white border-stone-100 hover:border-stone-200 text-stone-400'
          }`}
        >
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${mode === 'search' ? 'bg-ink text-white' : 'bg-stone-100 text-stone-400'}`}>
              <Search size={24} />
           </div>
           <h3 className={`font-serif font-bold text-xl mb-1 ${mode === 'search' ? 'text-ink' : 'text-stone-400'}`}>Standard Search</h3>
           <p className="text-sm text-stone-500">Find books by title, author, or ISBN.</p>
        </button>

        <button
          onClick={() => { setMode('ai'); setResults([]); setAiReason(''); }}
          className={`flex-1 p-6 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group ${
            mode === 'ai' 
              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg shadow-indigo-500/10' 
              : 'bg-white border-stone-100 hover:border-stone-200 text-stone-400'
          }`}
        >
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${mode === 'ai' ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
              <Sparkles size={24} />
           </div>
           <h3 className={`font-serif font-bold text-xl mb-1 ${mode === 'ai' ? 'text-indigo-900' : 'text-stone-400'}`}>AI Curator</h3>
           <p className="text-sm text-stone-500">Get personalized recommendations based on your taste.</p>
        </button>
      </div>

      {/* Input Section */}
      <div className="mb-12 animate-fade-in-up">
        {mode === 'search' ? (
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-accent transition-colors" size={24} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white border-2 border-stone-100 focus:border-accent/30 focus:ring-4 focus:ring-accent/10 outline-none text-lg text-ink placeholder:text-stone-300 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink text-white px-6 py-2.5 rounded-xl font-medium hover:bg-accent transition-colors disabled:opacity-70 disabled:hover:bg-ink"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your mood... e.g., 'A cozy mystery set in a snowy village' or 'Sci-fi that explores consciousness like Philip K. Dick'"
              className="w-full p-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-ink placeholder:text-stone-400 min-h-[120px] resize-none text-lg mb-4"
            />
            <div className="flex justify-end">
              <button 
                onClick={handleAiRecommend}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18}/> Generate Magic</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {aiReason && (
        <div className="max-w-4xl mx-auto bg-indigo-50/50 backdrop-blur-sm text-indigo-900 p-6 rounded-2xl border border-indigo-100 mb-10 animate-fade-in">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-lg"><Sparkles size={20} className="text-indigo-600"/> Why we picked these</h4>
          <p className="text-indigo-800 leading-relaxed opacity-90">{aiReason}</p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
        {results.map((book) => (
          <div key={book.id} className="relative group animate-fade-in-up">
             <BookCard book={book} />
             <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                    onClick={() => onAddBook(book, ShelfStatus.WANT_TO_READ)}
                    className="bg-ink text-white p-2.5 rounded-full shadow-xl hover:bg-accent hover:scale-110 transition-all"
                    title="Add to Want to Read"
                >
                    <Plus size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-stone-300">
          <BookCard 
            book={{id: 'preview', title: 'Your Next Favorite', authors: ['Waiting to be found'], thumbnail: ''}} 
            isOwner={false}
           />
           <div className="mt-8 text-center max-w-sm">
             <p className="text-stone-400 font-medium">Search for a title or ask our AI to discover your next obsession.</p>
           </div>
        </div>
      )}
    </div>
  );
};