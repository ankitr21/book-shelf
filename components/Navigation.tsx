import React from 'react';
import { Home, BookOpen, Search, User, Settings, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'feed', label: 'Timeline', icon: Home },
    { id: 'bookshelf', label: 'My Shelf', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-stone-100 h-screen sticky top-0 p-8 shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg shadow-orange-500/20">
            S
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">ShelfLife</h1>
        </div>

        <nav className="space-y-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden ${
                activeTab === item.id
                  ? 'bg-ink text-white shadow-xl shadow-stone-900/10 scale-100'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-ink hover:pl-6'
              }`}
            >
              <item.icon size={22} className={`transition-colors ${activeTab === item.id ? 'text-accent' : 'text-stone-400 group-hover:text-stone-600'}`} />
              <span className="relative z-10">{item.label}</span>
              {activeTab === item.id && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-stone-100">
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-4 rounded-xl border border-stone-200 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-ink mb-1">
                    <Sparkles size={16} className="text-accent"/>
                    <span>Daily Goal</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">You've read 12 pages today. Keep it up!</p>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[30%] rounded-full"></div>
                </div>
            </div>

            <button className="flex items-center gap-3 px-4 text-sm font-medium text-stone-400 hover:text-ink transition-colors">
            <Settings size={18} />
            Settings
            </button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-200 px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95 ${
              activeTab === item.id ? 'text-ink' : 'text-stone-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-stone-100' : ''}`}>
                <item.icon size={24} className={activeTab === item.id ? "text-accent fill-current" : ""} />
            </div>
            <span className={`text-[10px] font-semibold ${activeTab === item.id ? 'text-ink' : 'text-stone-400'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};