import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Moon,
  Sun,
  Headphones,
  Truck,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenAuth?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenLogin?: () => void;
  onOpenProfile?: () => void;
  onOpenUser?: () => void;
  onOpenTrackOrder?: () => void;
  onOpenSupport?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onLogoClick?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  toggleDarkMode?: () => void;
  onToggleTheme?: () => void;
  toggleTheme?: () => void;
  setIsDarkMode?: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAdminLogin,
  onOpenLogin,
  onOpenProfile,
  onOpenUser,
  onOpenTrackOrder,
  onOpenSupport,
  searchQuery = '',
  setSearchQuery,
  onLogoClick,
  isDarkMode = false,
  onToggleDarkMode,
  toggleDarkMode,
  onToggleTheme,
  toggleTheme,
}) => {
  // 1. Global & Real-time Logo Sync with Supabase + LocalStorage Backup
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bm_custom_logo') || null;
    } catch {
      return null;
    }
  });

  const [logoWidth, setLogoWidth] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('bm_logo_width')) || 100;
    } catch {
      return 100;
    }
  });

  const [logoHeight, setLogoHeight] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('bm_logo_height')) || 44;
    } catch {
      return 44;
    }
  });

  useEffect(() => {
    // 1. Initial Fetch Supabase database se
    const fetchGlobalLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('logo_url')
          .eq('id', 'global_config')
          .single();

        if (data && data.logo_url) {
          setCustomLogo(data.logo_url);
          localStorage.setItem('bm_custom_logo', data.logo_url);
        }
      } catch (err) {
        console.error('Error fetching global logo:', err);
      }
    };

    fetchGlobalLogo();

    // 2. Real-time broadcast listener taaki sabhi phones pe live change ho
    const channel = supabase
      .channel('header_realtime_logo')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_settings' },
        (payload: any) => {
          if (payload.new && payload.new.logo_url) {
            setCustomLogo(payload.new.logo_url);
            localStorage.setItem('bm_custom_logo', payload.new.logo_url);
          }
        }
      )
      .subscribe();

    // 3. Local browser changes sync
    const syncLocal = () => {
      try {
        setLogoWidth(Number(localStorage.getItem('bm_logo_width')) || 100);
        setLogoHeight(Number(localStorage.getItem('bm_logo_height')) || 44);
      } catch {}
    };
    window.addEventListener('storage', syncLocal);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', syncLocal);
    };
  }, []);

  // Unified Handlers
  const handleAuthClick = () => {
    if (onOpenAuth) onOpenAuth();
    else if (onOpenAdminLogin) onOpenAdminLogin();
    else if (onOpenProfile) onOpenProfile();
    else if (onOpenLogin) onOpenLogin();
    else if (onOpenUser) onOpenUser();
  };

  const handleDarkToggle = () => {
    if (onToggleDarkMode) onToggleDarkMode();
    else if (toggleDarkMode) toggleDarkMode();
    else if (onToggleTheme) onToggleTheme();
    else if (toggleTheme) toggleTheme();
  };

  return (
    <header className="sticky top-0 z-[50] bg-[#111622]/95 backdrop-blur-md border-b border-gray-800/80 transition-colors duration-300">
      {/* 1. TOP LUXURY ANNOUNCEMENT BAR */}
      <div className="bg-[#0B0F17] border-b border-gray-800/60 px-3 sm:px-8 py-1.5 text-[10px] sm:text-xs flex items-center justify-between text-gray-300">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <span className="bg-[#C59B27] text-black font-black uppercase text-[9px] px-1.5 py-0.5 rounded shadow">
            OFFER
          </span>
          <span className="font-bold truncate">
            ⚡ Free Shipping on orders over ₹499+ | Use Code:{' '}
            <strong className="text-[#C59B27]">BHARAT10</strong> for 10% OFF
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-gray-400 font-semibold shrink-0">
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1 hover:text-[#C59B27] transition cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#C59B27]" /> Track Order
            </button>
          )}
          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="flex items-center gap-1 hover:text-[#C59B27] transition cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-[#C59B27]" /> 24/7 Support
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* BRAND LOGO (CUSTOM UPLOADED OR LUXURY BM) */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          title="Go to Home"
        >
          {customLogo ? (
            <div className="flex items-center gap-2">
              <img
                src={customLogo}
                alt="BHARTMART Logo"
                className="object-contain rounded-xl shadow-sm transition-all"
                style={{
                  width: `${logoWidth || 100}px`,
                  maxHeight: `${logoHeight || 44}px`,
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#C59B27] to-[#8F6F16] flex items-center justify-center font-black text-black text-xs sm:text-sm shadow-md shrink-0">
                BM
              </div>
              <div className="hidden min-[360px]:block">
                <h1 className="text-sm sm:text-base font-black tracking-wider text-white leading-none">
                  BHARTMART
                </h1>
                <span className="text-[8px] sm:text-[9px] font-bold text-[#C59B27] tracking-widest block uppercase mt-0.5">
                  Curated Collections
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BAR (DESKTOP) */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search for products, fashion & more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-[#141A28] text-white text-xs pl-10 pr-10 py-2.5 rounded-2xl border border-gray-700/80 focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] outline-none transition placeholder-gray-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* RIGHT ACTIONS: NIGHT MODE, WISHLIST, PROFILE, CART */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NIGHT / DAY TOGGLE BUTTON */}
          <button
            type="button"
            onClick={handleDarkToggle}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition border border-gray-800 cursor-pointer shadow-sm"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-gray-300" />
            )}
          </button>

          {/* WISHLIST BUTTON WITH LIVE BADGE */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition border border-gray-800 cursor-pointer relative shadow-sm"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* USER / PROFILE / ADMIN LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleAuthClick}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/5 hover:bg-[#C59B27] text-gray-300 hover:text-black flex items-center justify-center transition border border-gray-800 cursor-pointer shadow-sm group"
            title="Account / Admin Login"
          >
            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {/* SHOPPING CART BUTTON */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#C59B27] hover:brightness-110 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-[#C59B27]/20 transition cursor-pointer active:scale-95"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden min-[480px]:inline">Cart</span>
            <span className="bg-black text-[#C59B27] text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. MOBILE SEARCH BAR (SHOWS UNDER HEADER ON PHONES) */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-[#141A28] text-white text-xs pl-9 pr-9 py-2 rounded-xl border border-gray-700/80 focus:border-[#C59B27] outline-none placeholder-gray-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};