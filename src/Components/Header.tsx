import React from 'react';
import { Search, ShoppingBag, Heart, User, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onAdminClick: () => void;
  onCartClick: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAdminClick,
  onCartClick,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  onSelectCategory
}) => {
  const { cartCount } = useStore();

  const navLinks = [
    { label: 'HOME', id: null },
    { label: 'MEN', id: 'men' },
    { label: 'WOMEN', id: 'women' },
    { label: 'FASHION', id: 'fashion', badge: 'HOT' },
    { label: 'ACCESSORIES', id: 'accessories' },
    { label: 'FOOTWEAR', id: 'footwear' },
    { label: 'BEAUTY', id: 'beauty' },
    { label: 'HOME & LIVING', id: 'home' },
    { label: 'OFFERS', id: 'offers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Banner (Photo 1 exact) */}
      <div className="bg-[#1C160C] text-[11px] text-amber-200/90 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>✨ Free Shipping on All Orders Above ₹499</span>
            <span className="hidden md:inline">• Cash on Delivery Available</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="cursor-pointer hover:text-white">Download App</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-white">Track Order</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo (Photo 1) */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectCategory(null)}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-md">
            BM
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
              BHART <span className="text-[#C59B27]">MART</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">
              CURATED COLLECTIONS
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 text-xs rounded-lg pl-4 pr-10 py-2.5 border border-gray-200 focus:outline-none focus:border-[#C59B27] focus:bg-white transition"
            />
            <button className="absolute right-1 top-1 bottom-1 px-3 bg-[#C59B27] hover:bg-[#B0881E] text-white rounded-md flex items-center justify-center transition">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C59B27] text-[#C59B27] hover:bg-amber-50 text-xs font-semibold transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden md:inline">Admin</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-[#C59B27] text-[11px] font-medium transition">
            <Heart className="w-4 h-4" />
            <span className="hidden md:inline mt-0.5">Wishlist</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-[#C59B27] text-[11px] font-medium transition">
            <User className="w-4 h-4" />
            <span className="hidden md:inline mt-0.5">Account</span>
          </button>

          <button
            onClick={onCartClick}
            className="relative flex flex-col items-center text-gray-800 hover:text-[#C59B27] text-[11px] font-medium transition"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C59B27] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline mt-0.5">Cart</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar (Photo 1) */}
      <div className="border-t border-gray-100 bg-white px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-7 overflow-x-auto py-2.5 text-xs font-semibold tracking-wide text-gray-700">
          <button
            onClick={() => onSelectCategory(null)}
            className="bg-black text-white px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
          >
            ☰ All Categories
          </button>
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => onSelectCategory(item.id)}
              className={`relative hover:text-[#C59B27] whitespace-nowrap transition uppercase tracking-wider ${
                (selectedCategory === item.id) || (item.id === null && !selectedCategory)
                  ? 'text-[#C59B27] font-bold'
                  : 'text-gray-600'
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="ml-1 text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};