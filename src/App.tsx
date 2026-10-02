import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { useTheme } from './Components/ThemeContext';

// Components Imports
import { Header } from './Components/Header';
import { NavbarPills } from './Components/NavbarPills';
import { HeroCarousel } from './Components/HeroCarousel';
import { LimitedStockShowcase } from './Components/LimitedStockShowcase';
import { ShopByCategory } from './Components/ShopByCategory';
import { ProductGrid } from './Components/ProductGrid';
import { ProductPage } from './Components/ProductPage';
import { Footer } from './Components/Footer';
import { TrustBar } from './Components/TrustBar';

// Modals & Drawers
import { CartDrawer } from './Components/CartDrawer';
import { WishlistModal } from './Components/WishlistModal';
import { AdminPanel } from './Components/AdminPanel';
import { AdminLoginModal } from './Components/AdminLoginModal';
import { CustomerAuthModal } from './Components/CustomerAuthModal';
import { TrackOrderModal } from './Components/TrackOrderModal';
import { SupportModal } from './Components/SupportModal';

// Type bypass wrappers (Prevents build warnings/errors)
const HeaderComp = Header as any;
const NavbarPillsComp = NavbarPills as any;
const HeroCarouselComp = HeroCarousel as any;
const LimitedStockComp = LimitedStockShowcase as any;
const ShopByCategoryComp = ShopByCategory as any;
const ProductGridComp = ProductGrid as any;
const FooterComp = Footer as any;
const CartDrawerComp = CartDrawer as any;
const WishlistModalComp = WishlistModal as any;
const AdminPanelComp = AdminPanel as any;
const AdminLoginModalComp = AdminLoginModal as any;
const CustomerAuthModalComp = CustomerAuthModal as any;
const TrackOrderModalComp = TrackOrderModal as any;
const SupportModalComp = SupportModal as any;

export function App() {
  const { theme } = useTheme();
  const themeCtx = useTheme() as any;

  // =========================================================================
  // 1. NIGHT / DARK MODE ENGINE
  // =========================================================================
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bharatmart_theme');
      if (saved) return saved === 'dark';
      if (typeof themeCtx?.isDarkMode === 'boolean') return themeCtx.isDarkMode;
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0B0F17';
      document.body.style.color = '#F3F4F6';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F8F9FA';
      document.body.style.color = '#111827';
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    if (themeCtx?.toggleDarkMode) themeCtx.toggleDarkMode();
    else if (themeCtx?.toggleTheme) themeCtx.toggleTheme();

    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('bharatmart_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // =========================================================================
  // 2. STORE DATA & STATE
  // =========================================================================
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist States
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('bm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('bm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Logged-in Customer State
  const [currentCustomer, setCurrentCustomer] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('bharatmart_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active Product Page State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Modals Visibility States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false); // Customer Phone/OTP Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const playSound = useCallback(
    (soundType: 'cart' | 'wishlist' | 'order') => {
      if (!theme.soundSettings?.enabled) return;
      try {
        let soundUrl = '';
        if (soundType === 'cart') soundUrl = theme.soundSettings.cartSound || '';
        if (soundType === 'wishlist') soundUrl = theme.soundSettings.wishlistSound || '';
        if (soundType === 'order') soundUrl = theme.soundSettings.orderSound || '';

        if (soundUrl) {
          const audio = new Audio(soundUrl);
          audio.play().catch(() => {});
        }
      } catch {}
    },
    [theme.soundSettings]
  );

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, bannerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('hero_banners').select('*').order('order_index', { ascending: true }),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (bannerRes.data) setHeroBanners(bannerRes.data);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // =========================================================================
  // 3. ADMIN PANEL HISTORY ROUTING & EXIT LOGIC
  // =========================================================================
  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    if (window.location.hash !== '#admin') {
      window.history.pushState({ modal: 'admin' }, '', window.location.pathname + window.location.search + '#admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.back();
    }
    fetchStoreData();
  };

  // Lock Body Scroll when Admin is open
  useEffect(() => {
    if (isAdminOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }
  }, [isAdminOpen]);

  // Handle Browser Back / Forward & Android Back Gesture
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#admin') {
        setIsAdminOpen(false);
        setIsAdminLoginOpen(false);
      }

      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      if (productId && products.length > 0) {
        const matched = products.find((p) => String(p.id) === String(productId));
        setSelectedProduct(matched || null);
      } else {
        setSelectedProduct(null);
      }

      document.body.style.overflow = 'auto';
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  useEffect(() => {
    if (window.location.hash === '#admin') {
      const isAuth =
        localStorage.getItem('bharatmart_admin_auth') === 'true' ||
        localStorage.getItem('admin_auth') === 'true';
      if (isAuth) {
        setIsAdminOpen(true);
      } else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  // =========================================================================
  // 4. CATEGORY & PRODUCT HANDLERS
  // =========================================================================
  const handleSelectCategory = (cat: any) => {
    const catName = typeof cat === 'object' ? (cat?.name || cat?.slug || '') : String(cat || '');

    if (
      catName.toLowerCase().includes('mode') ||
      catName.toLowerCase().includes('night') ||
      catName.toLowerCase().includes('dark')
    ) {
      handleToggleDarkMode();
      return;
    }

    if (!catName || catName.toUpperCase() === 'HOME' || catName.toUpperCase() === 'ALL') {
      setActiveCategory('All');
    } else {
      setActiveCategory(catName);
    }

    setTimeout(() => {
      const section = document.getElementById('products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 580, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    window.history.pushState({}, '', `/?product=${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'auto';
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'auto';
  };

  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: product.selectedSize || 'M' }];
    });
    playSound('cart');
  };

  const handleBuyNow = (product: any) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (product: any) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      playSound('wishlist');
      return [...prev, product];
    });
  };
  const handleMoveAllToCart = (items: any[]) => {
    if (!items || items.length === 0) return;

    setCart((prev) => {
      let updatedCart = [...prev];

      items.forEach((product: any) => {
        const targetSize = product.selectedSize || 'M';
        const existingIndex = updatedCart.findIndex(
          (item) => item.id === product.id && item.selectedSize === targetSize
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + 1,
          };
        } else {
          updatedCart.push({
            ...product,
            quantity: 1,
            selectedSize: targetSize,
          });
        }
      });

      return updatedCart;
    });

    setWishlist([]); // Wishlist khali ho jayegi
    setIsWishlistOpen(false); // Wishlist popup band ho jayega
    setIsCartOpen(true); // Direct Cart ka drawer khul jayega
    playSound('cart');
  };

  const displayedProducts = products.filter((p) => {
    if (activeCategory !== 'All' && activeCategory) {
      const pCat = (p.category || '').toLowerCase();
      const aCat = activeCategory.toLowerCase();
      const match = pCat === aCat || pCat.includes(aCat) || aCat.includes(pCat);
      if (!match) return false;
    }
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#0B0F17' : (theme?.colors?.background || '#F8F9FA'),
        color: isDarkMode ? '#F3F4F6' : (theme?.colors?.textPrimary || '#111827'),
        fontFamily: theme?.typography?.bodyFont || 'Inter',
      }}
    >
      {/* GLOBAL HEADER (Profile icon connected to CUSTOMER AUTH MODAL) */}
      <HeaderComp
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsCustomerAuthOpen(true)}
        onOpenProfile={() => setIsCustomerAuthOpen(true)}
        onOpenUser={() => setIsCustomerAuthOpen(true)}
        onOpenLogin={() => setIsCustomerAuthOpen(true)}
        onOpenAdminLogin={() => setIsCustomerAuthOpen(true)}
        currentCustomer={currentCustomer}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogoClick={handleCloseProduct}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        onToggleTheme={handleToggleDarkMode}
        toggleTheme={handleToggleDarkMode}
      />

      {/* DYNAMIC VIEW SWITCHER */}
      {selectedProduct ? (
        <ProductPage
          product={selectedProduct}
          allProducts={products}
          onBackToHome={handleCloseProduct}
          onSelectProduct={handleOpenProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      ) : (
        <main className="flex-1">
          {theme.sections.showCategories && (
            <NavbarPillsComp
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              toggleDarkMode={handleToggleDarkMode}
              onToggleTheme={handleToggleDarkMode}
              toggleTheme={handleToggleDarkMode}
            />
          )}

          {theme.sections.showHero && heroBanners.length > 0 && (
            <HeroCarouselComp
              banners={heroBanners}
              onBannerClick={(cat: any) => handleSelectCategory(cat)}
            />
          )}

          {theme.sections.showLimitedStock && (
            <LimitedStockComp
              products={products}
              onSelectProduct={handleOpenProduct}
            />
          )}

          {theme.sections.showShopByCat && (
            <ShopByCategoryComp
              onSelectCategory={(cat: any) => handleSelectCategory(cat)}
            />
          )}

          <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  {activeCategory === 'All' ? 'All Curated Drops' : `${activeCategory} Collection`}
                </h2>
                <p className="text-xs opacity-70 mt-1">
                  Showing {displayedProducts.length} verified premium items
                </p>
              </div>

              {activeCategory !== 'All' && (
                <button
                  onClick={() => handleSelectCategory('All')}
                  className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer"
                >
                  View All Products
                </button>
              )}
            </div>

            <ProductGridComp
              products={displayedProducts}
              loading={loading}
              onSelectProduct={handleOpenProduct}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              selectedCategory={activeCategory === 'All' ? null : activeCategory}
              searchTerm={searchQuery}
              onResetFilters={() => handleSelectCategory('All')}
              onOpenCart={() => setIsCartOpen(true)}
            />
          </section>

          <TrustBar />
        </main>
      )}

      {/* FOOTER (ONLY PLACE FOR ADMIN PANEL ACCESS VIA SECRET LOGO) */}
      {theme.sections.showFooter && (
        <FooterComp
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenAdminLogin={() => {
            const isAuth =
              localStorage.getItem('bharatmart_admin_auth') === 'true' ||
              localStorage.getItem('admin_auth') === 'true';
            if (isAuth) handleOpenAdmin();
            else setIsAdminLoginOpen(true);
          }}
          onSecretAdminClick={() => {
            const isAuth =
              localStorage.getItem('bharatmart_admin_auth') === 'true' ||
              localStorage.getItem('admin_auth') === 'true';
            if (isAuth) handleOpenAdmin();
            else setIsAdminLoginOpen(true);
          }}
          onSecretLogoClick={() => {
            const isAuth =
              localStorage.getItem('bharatmart_admin_auth') === 'true' ||
              localStorage.getItem('admin_auth') === 'true';
            if (isAuth) handleOpenAdmin();
            else setIsAdminLoginOpen(true);
          }}
          onAdminClick={() => {
            const isAuth =
              localStorage.getItem('bharatmart_admin_auth') === 'true' ||
              localStorage.getItem('admin_auth') === 'true';
            if (isAuth) handleOpenAdmin();
            else setIsAdminLoginOpen(true);
          }}
        />
      )}

      {/* DRAWERS & MODALS */}
      <CartDrawerComp
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        onCheckoutSuccess={() => playSound('order')}
      />

      <WishlistModalComp
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleAddToCart}
        onMoveAllToCart={handleMoveAllToCart}
        isDarkMode={isDarkMode}
      />

      {/* 1. CUSTOMER AUTH MODAL (PHONE + OTP LOGIN) */}
      <CustomerAuthModalComp
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onLoginSuccess={(user: any) => {
          setCurrentCustomer(user);
          setIsCustomerAuthOpen(false);
        }}
      />

      <TrackOrderModalComp
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      <SupportModalComp
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* 2. ADMIN LOGIN MODAL */}
      <AdminLoginModalComp
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          handleOpenAdmin();
        }}
      />

      {/* 3. ADMIN PANEL MODAL */}
      <AdminPanelComp
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

export default App;