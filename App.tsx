import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Feed } from './components/Feed';
import { Bookshelf } from './components/Bookshelf';
import { Explore } from './components/Explore';
import { INITIAL_BOOKS, INITIAL_POSTS, MOCK_USER } from './constants';
import { Book, ShelfStatus, UserBook, Post } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [myBooks, setMyBooks] = useState<UserBook[]>(INITIAL_BOOKS);
  const [feedPosts, setFeedPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleAddBook = (book: Book, status: ShelfStatus) => {
    const newBook: UserBook = {
      ...book,
      status,
      progress: 0,
      dateAdded: Date.now(),
    };
    
    // Check if already exists
    if (myBooks.some(b => b.id === book.id)) {
      alert("This book is already on your shelf!");
      return;
    }

    setMyBooks([newBook, ...myBooks]);
    
    const newPost: Post = {
      id: `new-post-${Date.now()}`,
      userId: MOCK_USER.id,
      user: MOCK_USER,
      content: `Added "${book.title}" to my ${status} shelf.`,
      timestamp: Date.now(),
      likes: 0,
      comments: 0,
      type: 'ADD',
      book: book
    };
    setFeedPosts([newPost, ...feedPosts]);
    setActiveTab('bookshelf');
  };

  const handleCreatePost = (content: string, bookId?: string) => {
    const taggedBook = bookId ? myBooks.find(b => b.id === bookId) : undefined;
    
    const newPost: Post = {
      id: `user-post-${Date.now()}`,
      userId: MOCK_USER.id,
      user: MOCK_USER,
      content,
      timestamp: Date.now(),
      likes: 0,
      comments: 0,
      type: taggedBook ? 'REVIEW' : 'UPDATE', // simplified logic
      book: taggedBook
    };

    setFeedPosts([newPost, ...feedPosts]);
  };

  const handleUpdateStatus = (id: string, status: ShelfStatus) => {
    setMyBooks(prev => prev.map(b => {
      if (b.id === id) return { ...b, status };
      return b;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <Feed 
            posts={feedPosts} 
            currentUser={MOCK_USER} 
            userBooks={myBooks}
            onPostCreate={handleCreatePost}
          />
        );
      case 'bookshelf':
        return <Bookshelf books={myBooks} onUpdateStatus={handleUpdateStatus} />;
      case 'explore':
        return <Explore currentBooks={myBooks} onAddBook={handleAddBook} />;
      case 'profile':
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-fade-in">
                <div className="relative mb-6 group">
                  <div className="absolute inset-0 bg-accent blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                  <img src={MOCK_USER.avatar} className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white object-cover" alt="Profile" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-ink mb-1">{MOCK_USER.name}</h2>
                <p className="text-stone-400 font-medium mb-6 text-sm tracking-wide">{MOCK_USER.handle}</p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-lg w-full mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                    <p className="text-stone-600 italic font-serif text-lg leading-relaxed">"{MOCK_USER.bio}"</p>
                </div>
                <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                        <div className="text-3xl font-bold text-ink mb-1">{myBooks.length}</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Books</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                        <div className="text-3xl font-bold text-ink mb-1">12</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Friends</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                        <div className="text-3xl font-bold text-ink mb-1">450</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Pages</div>
                    </div>
                </div>
            </div>
        );
      default:
        return <Feed posts={feedPosts} currentUser={MOCK_USER} userBooks={myBooks} onPostCreate={handleCreatePost} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] font-sans selection:bg-accent/20">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto h-screen scroll-smooth">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;