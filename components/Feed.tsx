import React, { useState } from 'react';
import { Post, User, UserBook, ShelfStatus } from '../types';
import { Heart, MessageCircle, Share2, Bookmark, Send, BookOpen, X } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  userBooks: UserBook[];
  onPostCreate: (content: string, bookId?: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, currentUser, userBooks, onPostCreate }) => {
  const [localPosts, setLocalPosts] = useState(posts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);

  // Sync props to local state if needed, or just use props if state management is lifted
  React.useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleLike = (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
            return { ...post, likes: post.likes + 1 };
        }
        return post;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    onPostCreate(newPostContent, selectedBookId || undefined);
    setNewPostContent('');
    setSelectedBookId('');
    setIsPosting(false);
  };

  // Filter books that are appropriate for tagging (Reading or Completed)
  const taggableBooks = userBooks.filter(b => 
    b.status === ShelfStatus.READING || b.status === ShelfStatus.COMPLETED
  );

  const selectedBook = userBooks.find(b => b.id === selectedBookId);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 pb-32">
      <header className="flex items-end justify-between mb-2">
        <div>
            <h2 className="text-4xl font-serif font-bold text-ink tracking-tight">Timeline</h2>
            <p className="text-stone-500 font-medium mt-1">Discover what your circle is reading.</p>
        </div>
      </header>

      {/* Create Post Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="p-4 sm:p-6">
          <div className="flex gap-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-12 h-12 rounded-full object-cover ring-4 ring-stone-50"
            />
            <div className="flex-1">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onFocus={() => setIsPosting(true)}
                  placeholder="Share your thoughts or a favorite quote..."
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg placeholder:text-stone-400 min-h-[60px] resize-none text-ink"
                />
                
                {selectedBook && (
                  <div className="mt-3 flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100 group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 bg-stone-200 rounded overflow-hidden shadow-sm">
                         {selectedBook.thumbnail && <img src={selectedBook.thumbnail} className="w-full h-full object-cover" />}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-ink leading-tight">{selectedBook.title}</p>
                        <p className="text-stone-500 text-xs">Currently reading</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedBookId('')}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className={`flex items-center justify-between mt-4 pt-3 border-t border-stone-50 transition-all duration-300 ${isPosting || newPostContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'}`}>
                  <div className="relative">
                    <select
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      className="appearance-none bg-stone-50 text-stone-600 text-sm font-medium py-2 pl-9 pr-4 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer hover:bg-stone-100 transition-colors"
                    >
                      <option value="">Tag a book...</option>
                      {taggableBooks.map(b => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                      ))}
                    </select>
                    <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="bg-ink text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:hover:bg-ink flex items-center gap-2"
                  >
                    <span>Post</span>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {localPosts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-ink text-lg leading-tight">{post.user.name}</h4>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {post.type === 'ADD' ? 'added to shelf' : post.type.toLowerCase()}
                    </p>
                  </div>
                </div>

                {post.content && <p className="text-stone-700 mt-3 leading-relaxed text-[15px]">{post.content}</p>}

                {post.book && (
                  <div className="mt-4 flex gap-4 bg-[#faf9f6] p-4 rounded-xl border border-[#ebe8e0] group cursor-pointer hover:border-accent/30 transition-colors">
                    <div className="h-24 w-16 flex-shrink-0 shadow-md rounded overflow-hidden bg-stone-200">
                        <img 
                            src={post.book.thumbnail} 
                            alt={post.book.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col justify-center py-1">
                      <h5 className="font-serif font-bold text-ink text-lg leading-tight group-hover:text-accent transition-colors">{post.book.title}</h5>
                      <p className="text-sm text-stone-500 font-medium">{post.book.authors.join(', ')}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-8 text-stone-400">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 hover:text-rose-500 transition-all active:scale-95 group"
                  >
                    <Heart size={20} className={post.likes > 0 ? "fill-rose-50 text-rose-500" : "group-hover:fill-rose-50"} />
                    <span className="text-sm font-medium">{post.likes > 0 ? post.likes : ''}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-indigo-500 transition-all active:scale-95 group">
                    <MessageCircle size={20} className="group-hover:fill-indigo-50" />
                    <span className="text-sm font-medium">{post.comments > 0 ? post.comments : ''}</span>
                  </button>
                  <div className="flex-1"></div>
                  <button className="hover:text-ink transition-colors">
                      <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};