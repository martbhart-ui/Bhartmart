import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  RefreshCw,
  TrendingUp,
  Plus,
  Trash2,
  Layers,
  ArrowLeft,
  Search,
  Grid,
  LayoutGrid,
  Flame,
  Check,
  Save,
  Film,
  Image as ImageIcon,
  Boxes,
  Minus,
  TicketPercent,
  Headphones,
  Sliders,
  Eye,
  Upload,
  Volume2,
  ShieldCheck,
  Play,
  QrCode,
  Mail,
  KeyRound,
  CreditCard,
  Palette,
  Type,
  Code,
  Sparkles,
  Phone,
  Clock,
  Video,
  MessageSquare,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme, type ThemeConfig, defaultTheme } from './ThemeContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_THEMES = [
  {
    name: 'Midnight Luxury',
    desc: 'Deep Obsidian with Gold accents, iconic streetwear luxury.',
    preview: ['#0B0F17', '#C59B27', '#E5B842'],
    theme: {
      activePreset: 'Midnight Luxury',
      colors: {
        background: '#0B0F17',
        cardBg: '#141A28',
        primary: '#C59B27',
        secondary: '#E5B842',
        textPrimary: '#FFFFFF',
        textMuted: '#9CA3AF',
        borderColor: '#1F2937',
      },
      gradients: { enabled: true, fromColor: '#C59B27', toColor: '#E5B842', angle: 135 },
    },
  },
  {
    name: 'Cyber Neon',
    desc: 'High-octane neon cyan and purple with pitch black depth.',
    preview: ['#050811', '#06b6d4', '#a855f7'],
    theme: {
      activePreset: 'Cyber Neon',
      colors: {
        background: '#050811',
        cardBg: '#0f172a',
        primary: '#06b6d4',
        secondary: '#a855f7',
        textPrimary: '#F8FAFC',
        textMuted: '#64748B',
        borderColor: '#1e293b',
      },
      gradients: { enabled: true, fromColor: '#06b6d4', toColor: '#a855f7', angle: 90 },
    },
  },
  {
    name: 'Rose Gold Royale',
    desc: 'Warm blush luxury tones for elevated modern aesthetics.',
    preview: ['#120D12', '#f43f5e', '#fb7185'],
    theme: {
      activePreset: 'Rose Gold Royale',
      colors: {
        background: '#120D12',
        cardBg: '#1F1420',
        primary: '#f43f5e',
        secondary: '#fb7185',
        textPrimary: '#FFF1F2',
        textMuted: '#FDA4AF',
        borderColor: '#2D1B2E',
      },
      gradients: { enabled: true, fromColor: '#f43f5e', toColor: '#fb7185', angle: 120 },
    },
  },
  {
    name: 'Deep Emerald',
    desc: 'Wealth and prestigious vibes with intense dark emerald tones.',
    preview: ['#06130D', '#10b981', '#34d399'],
    theme: {
      activePreset: 'Deep Emerald',
      colors: {
        background: '#06130D',
        cardBg: '#0B2217',
        primary: '#10b981',
        secondary: '#34d399',
        textPrimary: '#ECFDF5',
        textMuted: '#6EE7B7',
        borderColor: '#133D29',
      },
      gradients: { enabled: true, fromColor: '#10b981', toColor: '#34d399', angle: 145 },
    },
  },
  {
    name: 'Crimson Velvet',
    desc: 'Bold seductive maroon red accents for high-end drops.',
    preview: ['#14070A', '#e11d48', '#f43f5e'],
    theme: {
      activePreset: 'Crimson Velvet',
      colors: {
        background: '#14070A',
        cardBg: '#210C11',
        primary: '#e11d48',
        secondary: '#f43f5e',
        textPrimary: '#FFF1F2',
        textMuted: '#FDA4AF',
        borderColor: '#37141C',
      },
      gradients: { enabled: true, fromColor: '#e11d48', toColor: '#f43f5e', angle: 110 },
    },
  },
  {
    name: 'Monochrome Clean',
    desc: 'Minimalist high-contrast stark editorial aesthetic.',
    preview: ['#FFFFFF', '#000000', '#555555'],
    theme: {
      activePreset: 'Monochrome Clean',
      colors: {
        background: '#F9FAFB',
        cardBg: '#FFFFFF',
        primary: '#111827',
        secondary: '#4B5563',
        textPrimary: '#111827',
        textMuted: '#6B7280',
        borderColor: '#E5E7EB',
      },
      gradients: { enabled: false, fromColor: '#111827', toColor: '#4B5563', angle: 0 },
    },
  },
];

const GOOGLE_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Outfit',
  'Syne',
  'Montserrat',
  'Poppins',
  'Roboto',
  'Space Grotesk',
  'Cinzel',
  'Playfair Display',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { theme: liveTheme, updateTheme, saveThemeToDb } = useTheme();
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(liveTheme);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaveSuccess, setThemeSaveSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'ordersDispatch'
    | 'themeEngine'
    | 'logoFavicon'
    | 'soundSettings'
    | 'adminSecurity'
    | 'support'
    | 'coupons'
    | 'stockControl'
    | 'products'
    | 'heroCarousel'
    | 'limitedStock'
    | 'categories'
    | 'shopByCat'
    | 'navButtons'
    | 'reviewsModeration'
  >('products');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [navButtons, setNavButtons] = useState<any[]>([]);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supportFilter, setSupportFilter] = useState<'All' | 'Open' | 'Resolved'>('All');
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Logo Settings Form State
  const [logoUrl, setLogoUrl] = useState(liveTheme.logoSettings?.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(liveTheme.logoSettings?.faviconUrl || '');
  const [logoWidth, setLogoWidth] = useState(liveTheme.logoSettings?.width || 100);
  const [logoHeight, setLogoHeight] = useState(liveTheme.logoSettings?.height || 100);
  const [blendMode, setBlendMode] = useState(liveTheme.logoSettings?.blendMode || 'multiply');
  const [objectFit, setObjectFit] = useState(liveTheme.logoSettings?.objectFit || 'contain');
  const [brightness, setBrightness] = useState(liveTheme.logoSettings?.brightness || 100);
  const [invert, setInvert] = useState(liveTheme.logoSettings?.invert || false);
  const [logoUploading, setLogoUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `store-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // 1. Supabase Storage me upload
      const { error: uploadError } = await supabase.storage
        .from('store-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Public link lo
      const { data } = supabase.storage
        .from('store-assets')
        .getPublicUrl(filePath);

      // 3. Database me update
      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global_config',
          logo_url: data.publicUrl,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // Local state bhi update kar do taaki screen par turant dikhe
      setLogoUrl(data.publicUrl);

      alert('Logo globally update ho gaya!');
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  // Sound Settings States
  const [soundEnabled, setSoundEnabled] = useState(liveTheme.soundSettings?.enabled ?? true);
  const [wishlistSound, setWishlistSound] = useState(liveTheme.soundSettings?.wishlistSound || '');
  const [cartSound, setCartSound] = useState(liveTheme.soundSettings?.cartSound || '');
  const [orderSound, setOrderSound] = useState(liveTheme.soundSettings?.orderSound || '');

  // Admin Security & Payment States
  const [codEnabled, setCodEnabled] = useState(liveTheme.securitySettings?.codEnabled ?? true);
  const [upiId, setUpiId] = useState(liveTheme.securitySettings?.upiId || 'vedantgadewar291-1@okicici');
  const [gatewayPhone, setGatewayPhone] = useState(liveTheme.securitySettings?.gatewayPhone || '+91 90224 82630');
  const [qrCodeUrl, setQrCodeUrl] = useState(liveTheme.securitySettings?.qrCodeUrl || '');
  const [showcaseTitle, setShowcaseTitle] = useState(liveTheme.securitySettings?.showcaseTitle || '🔥 LIMITED STOCK ONLY — SELLING FAST');
  const [showcaseSubtitle, setShowcaseSubtitle] = useState(liveTheme.securitySettings?.showcaseSubtitle || 'Exclusive high-demand products with limited inventory. Grab yours before stock runs out!');
  const [showcaseEnabled, setShowcaseEnabled] = useState(liveTheme.securitySettings?.showcaseEnabled ?? true);

  // Credentials States
  const [newAdminEmail, setNewAdminEmail] = useState(liveTheme.securitySettings?.adminEmail || 'martbharat5@gmail.com');
  const [verifyPasswordForEmail, setVerifyPasswordForEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Limited Stock States
  const [showcaseActive, setShowcaseActive] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [savingShowcase, setSavingShowcase] = useState(false);

  // Hero Banners Form State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerTag, setNewBannerTag] = useState('NEW DROP LIVE');
  const [newBannerMediaUrl, setNewBannerMediaUrl] = useState('');
  const [newBannerCta, setNewBannerCta] = useState('Shop Collection');
  const [newBannerCategory, setNewBannerCategory] = useState('');
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Coupons Form State
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountVal, setDiscountVal] = useState('');
  const [minOrderVal, setMinOrderVal] = useState('0');
  const [expiryDate, setExpiryDate] = useState('');
  const [isCouponActive, setIsCouponActive] = useState(true);
  const [savingCoupon, setSavingCoupon] = useState(false);

  // Product Form State (Match Screenshot)
  const [showAddProductCard, setShowAddProductCard] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [shippingCharge, setShippingCharge] = useState('0');
  const [originalPrice, setOriginalPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [primaryMediaUrl, setPrimaryMediaUrl] = useState('');
  const [additionalMediaUrls, setAdditionalMediaUrls] = useState<string[]>([]);
  const [newStock, setNewStock] = useState('20');
  const [description, setDescription] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [hasSizes, setHasSizes] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Categories & Cards
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Shop By Category
  const [showAddShopCatModal, setShowAddShopCatModal] = useState(false);
  const [shopCatTitle, setShopCatTitle] = useState('');
  const [shopCatImage, setShopCatImage] = useState('');
  const [shopCatLink, setShopCatLink] = useState('');
  const [savingShopCat, setSavingShopCat] = useState(false);

  // Nav Buttons
  const [showAddNavModal, setShowAddNavModal] = useState(false);
  const [navLabel, setNavLabel] = useState('');
  const [navKey, setNavKey] = useState('');
  const [savingNav, setSavingNav] = useState(false);

  useEffect(() => {
    setLocalTheme(liveTheme);
    if (liveTheme.logoSettings) {
      setLogoUrl(liveTheme.logoSettings?.logoUrl || '');
      setFaviconUrl(liveTheme.logoSettings?.faviconUrl || '');
      setLogoWidth(liveTheme.logoSettings?.width || 100);
      setLogoHeight(liveTheme.logoSettings?.height || 100);
      setBlendMode(liveTheme.logoSettings?.blendMode || 'multiply');
      setObjectFit(liveTheme.logoSettings?.objectFit || 'contain');
      setBrightness(liveTheme.logoSettings?.brightness || 100);
      setInvert(liveTheme.logoSettings?.invert || false);
    }
    if (liveTheme.soundSettings) {
      setSoundEnabled(liveTheme.soundSettings?.enabled ?? true);
      setWishlistSound(liveTheme.soundSettings?.wishlistSound || '');
      setCartSound(liveTheme.soundSettings?.cartSound || '');
      setOrderSound(liveTheme.soundSettings?.orderSound || '');
    }
    if (liveTheme.securitySettings) {
      setCodEnabled(liveTheme.securitySettings?.codEnabled ?? true);
      setUpiId(liveTheme.securitySettings?.upiId || 'vedantgadewar291-1@okicici');
      setGatewayPhone(liveTheme.securitySettings?.gatewayPhone || '+91 90224 82630');
      setQrCodeUrl(liveTheme.securitySettings?.qrCodeUrl || '');
      setShowcaseTitle(liveTheme.securitySettings?.showcaseTitle || '🔥 LIMITED STOCK ONLY — SELLING FAST');
      setShowcaseSubtitle(liveTheme.securitySettings?.showcaseSubtitle || 'Exclusive high-demand products with limited inventory.');
      setShowcaseEnabled(liveTheme.securitySettings?.showcaseEnabled ?? true);
      setNewAdminEmail(liveTheme.securitySettings?.adminEmail || 'martbharat5@gmail.com');
    }
  }, [liveTheme]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        ordersRes,
        productsRes,
        categoriesRes,
        shopCatRes,
        navRes,
        showcaseRes,
        heroRes,
        couponRes,
        supportRes,
        reviewsRes,
      ] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('shop_categories').select('*').order('created_at', { ascending: true }),
        supabase.from('nav_buttons').select('*').order('order_index', { ascending: true }),
        supabase.from('showcase_settings').select('*').eq('id', 'limited_stock').maybeSingle(),
        supabase.from('hero_banners').select('*').order('order_index', { ascending: true }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('product_reviews').select('*').order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (shopCatRes.data) setShopCategories(shopCatRes.data);
      if (navRes.data) setNavButtons(navRes.data);
      if (heroRes.data) setHeroBanners(heroRes.data);
      if (couponRes.data) setCoupons(couponRes.data);
      if (supportRes.data) setSupportTickets(supportRes.data);
      if (reviewsRes.data) setCustomerReviews(reviewsRes.data);

      if (showcaseRes.data) {
        setShowcaseActive(showcaseRes.data.is_active || false);
        const existingIds: string[] = showcaseRes.data.product_ids || [];
        const autoLowStockIds = (productsRes.data || [])
          .filter((p: any) => Number(p.stock) > 0 && Number(p.stock) < 15)
          .map((p: any) => String(p.id));
        setSelectedProductIds(Array.from(new Set([...existingIds, ...autoLowStockIds])));
      }
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, loadAllData]);

  // Direct Primary cover image / video upload to Supabase Storage
  const handleUploadPrimaryMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPrimary(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `primary-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setPrimaryMediaUrl(data.publicUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message + '. Ensure bucket "product-images" exists in Supabase.');
    } finally {
      setUploadingPrimary(false);
    }
  };

  // Additional 5-7 gallery media upload
  const handleUploadGalleryMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }

      setAdditionalMediaUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      alert('Gallery upload failed: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // Save product to database
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !primaryMediaUrl.trim()) {
      alert('Please fill Product Title, Selling Price, and Primary Media!');
      return;
    }

    setSavingProduct(true);
    try {
      const { data, error } = await supabase.from('products').insert([
        {
          name: newTitle.trim(),
          category: newCategory || 'General',
          price: Number(newPrice),
          original_price: originalPrice ? Number(originalPrice) : null,
          shipping_charge: Number(shippingCharge) || 0,
          stock: Number(newStock) || 20,
          image_url: primaryMediaUrl.trim(),
          gallery_images: additionalMediaUrls,
          description: description.trim(),
          is_trending: isTrending,
          has_sizes: hasSizes,
        },
      ]).select();

      if (error) throw error;
      if (data && data[0]) setProducts((prev) => [data[0], ...prev]);

      setNewTitle('');
      setNewCategory('');
      setShippingCharge('0');
      setOriginalPrice('');
      setNewPrice('');
      setPrimaryMediaUrl('');
      setAdditionalMediaUrls([]);
      setNewStock('20');
      setDescription('');
      setIsTrending(false);
      setHasSizes(true);
      alert('Product saved permanently!');
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const finalStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: finalStock } : p))
    );
    await supabase.from('products').update({ stock: finalStock }).eq('id', productId);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    setUpdatingId(null);
  };

  const handleTestAudio = (url: string) => {
    if (!url) return;
    try {
      const audio = new Audio(url);
      audio.play().catch(() => alert('Audio test error: Check URL'));
    } catch {
      alert('Invalid Audio URL');
    }
  };

  const handleSaveSoundSettings = async () => {
    setIsSavingTheme(true);
    const updated: ThemeConfig = {
      ...localTheme,
      soundSettings: { enabled: soundEnabled, wishlistSound, cartSound, orderSound },
    };
    updateTheme(updated);
    const success = await saveThemeToDb(updated);
    setIsSavingTheme(false);
    if (success) {
      setThemeSaveSuccess(true);
      setTimeout(() => setThemeSaveSuccess(false), 2500);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setIsSavingTheme(true);
    const updated: ThemeConfig = {
      ...localTheme,
      securitySettings: {
        ...localTheme.securitySettings,
        codEnabled,
        upiId,
        gatewayPhone,
        qrCodeUrl,
        showcaseTitle,
        showcaseSubtitle,
        showcaseEnabled,
      },
    };
    updateTheme(updated);
    const success = await saveThemeToDb(updated);
    setIsSavingTheme(false);
    if (success) {
      setThemeSaveSuccess(true);
      setTimeout(() => setThemeSaveSuccess(false), 2500);
    }
  };

  const handleUpdateAdminEmail = async () => {
    const currentStoredPass = localTheme.securitySettings?.adminPass || 'mayved@2026';
    if (verifyPasswordForEmail !== currentStoredPass) {
      alert('Incorrect password! Verification failed.');
      return;
    }
    const updated: ThemeConfig = {
      ...localTheme,
      securitySettings: { ...localTheme.securitySettings, adminEmail: newAdminEmail.trim() },
    };
    updateTheme(updated);
    await saveThemeToDb(updated);
    setVerifyPasswordForEmail('');
    alert('Admin Email updated successfully!');
  };

  const handleUpdateAdminPassword = async () => {
    const currentStoredPass = localTheme.securitySettings?.adminPass || 'mayved@2026';
    if (currentPassword !== currentStoredPass) {
      alert('Current password does not match!');
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      alert('New passwords do not match or are empty!');
      return;
    }
    const updated: ThemeConfig = {
      ...localTheme,
      securitySettings: { ...localTheme.securitySettings, adminPass: newPassword.trim() },
    };
    updateTheme(updated);
    await saveThemeToDb(updated);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Admin password updated successfully!');
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `store-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // 1. Supabase Storage bucket me upload karo
      const { error: uploadError } = await supabase.storage
        .from('store-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Public link lo
      const { data } = supabase.storage
        .from('store-assets')
        .getPublicUrl(filePath);

      // 3. State update karo taaki UI aur preview me turant dikhe
      setLogoUrl(data.publicUrl);
      alert('Logo cloud par upload ho gaya! Ab upar "Save Settings" par click kar do.');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSaveLogoSettings = async () => {
    setIsSavingTheme(true);
    const updated: ThemeConfig = {
      ...localTheme,
      logoSettings: {
        logoUrl,
        faviconUrl,
        width: Number(logoWidth),
        height: Number(logoHeight),
        blendMode,
        objectFit,
        brightness: Number(brightness),
        invert,
      },
    };
    updateTheme(updated);
    await saveThemeToDb(updated);
    setIsSavingTheme(false);
    setThemeSaveSuccess(true);
    setTimeout(() => setThemeSaveSuccess(false), 2500);
  };
  void handleSaveLogoSettings;

  const handleApplyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    const updated = {
      ...localTheme,
      ...preset.theme,
      activePreset: preset.name,
      colors: { ...localTheme.colors, ...preset.theme.colors },
      gradients: { ...localTheme.gradients, ...preset.theme.gradients },
    };
    setLocalTheme(updated);
    updateTheme(updated);
  };

  const handleSaveThemeSettings = async () => {
    setIsSavingTheme(true);
    const success = await saveThemeToDb(localTheme);
    setIsSavingTheme(false);
    if (success) {
      setThemeSaveSuccess(true);
      setTimeout(() => setThemeSaveSuccess(false), 2500);
    }
  };

  const handleResetTheme = () => {
    if (confirm('Reset store theme to default colors & fonts?')) {
      setLocalTheme(defaultTheme);
      updateTheme(defaultTheme);
    }
  };

  const handleToggleTicketStatus = async (ticketId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
    await supabase.from('support_tickets').update({ status: nextStatus }).eq('id', ticketId);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !discountVal) return;
    setSavingCoupon(true);
    const cleanCode = couponCode.trim().toUpperCase().replace(/\s+/g, '');
    const { data } = await supabase.from('coupons').insert([
      {
        code: cleanCode,
        description: couponDesc.trim(),
        discount_type: discountType,
        discount_value: Number(discountVal),
        min_order_value: Number(minOrderVal) || 0,
        expiry_date: expiryDate,
        is_active: isCouponActive,
      },
    ]).select();
    if (data && data[0]) setCoupons((prev) => [data[0], ...prev]);
    setSavingCoupon(false);
    setShowAddCoupon(false);
    setCouponCode('');
    setCouponDesc('');
    setDiscountVal('');
  };

  const handleDeleteCoupon = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleCouponStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
    );
  };

  const handleSaveShowcase = async () => {
    setSavingShowcase(true);
    try {
      const { error } = await supabase.from('showcase_settings').upsert([
        {
          id: 'limited_stock',
          is_active: showcaseActive,
          product_ids: selectedProductIds,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      localStorage.setItem('bm_limited_stock_active', String(showcaseActive));
      localStorage.setItem('bm_limited_stock_ids', JSON.stringify(selectedProductIds));
      window.dispatchEvent(new Event('storage'));

      setThemeSaveSuccess(true);
      setTimeout(() => setThemeSaveSuccess(false), 2500);
      alert('✓ Limited Stock Showcase settings successfully saved!');
    } catch (err: any) {
      alert('Save Error: ' + (err.message || 'Failed to save showcase settings'));
    } finally {
      setSavingShowcase(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleAddHeroBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerMediaUrl) return;
    setIsSavingBanner(true);
    const { data } = await supabase.from('hero_banners').insert([
      {
        title: newBannerTitle.trim(),
        subtitle: newBannerSubtitle.trim(),
        tag: newBannerTag.trim() || 'FEATURED COLLECTION',
        media_type: 'image',
        media_url: newBannerMediaUrl.trim(),
        cta_text: newBannerCta.trim() || 'Shop Collection',
        category_link: newBannerCategory.trim(),
        order_index: heroBanners.length + 1,
      },
    ]).select();
    if (data && data[0]) setHeroBanners((prev) => [...prev, data[0]]);
    setIsSavingBanner(false);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerMediaUrl('');
  };

  const handleDeleteHeroBanner = async (id: string) => {
    await supabase.from('hero_banners').delete().eq('id', id);
    setHeroBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catImageUrl) return;
    setSavingCategory(true);
    const { data } = await supabase.from('categories').insert([
      { name: catName.trim(), image_url: catImageUrl.trim() },
    ]).select();
    if (data && data[0]) setCategories((prev) => [...prev, data[0]]);
    setSavingCategory(false);
    setShowAddCategoryModal(false);
    setCatName('');
    setCatImageUrl('');
  };

  const handleDeleteCategory = async (catId: string) => {
    await supabase.from('categories').delete().eq('id', catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleCreateShopCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopCatTitle || !shopCatImage) return;
    setSavingShopCat(true);
    const { data } = await supabase.from('shop_categories').insert([
      {
        title: shopCatTitle.trim().toUpperCase(),
        image_url: shopCatImage.trim(),
        link_category: shopCatLink.trim() || shopCatTitle.trim(),
      },
    ]).select();
    if (data && data[0]) setShopCategories((prev) => [...prev, data[0]]);
    setSavingShopCat(false);
    setShowAddShopCatModal(false);
    setShopCatTitle('');
    setShopCatImage('');
    setShopCatLink('');
  };

  const handleDeleteShopCategory = async (id: string) => {
    await supabase.from('shop_categories').delete().eq('id', id);
    setShopCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateNavButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navLabel) return;
    setSavingNav(true);
    const { data } = await supabase.from('nav_buttons').insert([
      {
        label: navLabel.trim(),
        category_key: navKey.trim() || navLabel.trim(),
        order_index: navButtons.length + 1,
      },
    ]).select();
    if (data && data[0]) setNavButtons((prev) => [...prev, data[0]]);
    setSavingNav(false);
    setShowAddNavModal(false);
    setNavLabel('');
    setNavKey('');
  };

  const handleDeleteNavButton = async (id: string) => {
    await supabase.from('nav_buttons').delete().eq('id', id);
    setNavButtons((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete customer review?')) return;
    await supabase.from('product_reviews').delete().eq('id', reviewId);
    setCustomerReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.includes(searchTerm) ||
      o.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = orderFilter === 'All' || (o.status || 'Pending') === orderFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredStockProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupportTickets = supportTickets.filter((t) => {
    if (supportFilter === 'Open') return t.status === 'Open';
    if (supportFilter === 'Resolved') return t.status === 'Resolved';
    return true;
  });

  const combinedCategories = Array.from(
    new Set([
      ...navButtons.map((b) => b.category_key),
      ...categories.map((c) => c.name),
      'Footwear',
      'T-Shirts',
      'Hoodies',
      'Oversized',
    ])
  );

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  };

  if (!isOpen) return null;return (
<div className="fixed inset-0 w-full h-[100dvh] z-[9999] bg-[#0B0F17] text-gray-100 flex flex-col font-sans overflow-hidden">      {/* 1. TOP BAR */}
      <header className="h-16 border-b border-gray-800 bg-[#111622] px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer border border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Exit to Store
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C59B27] flex items-center justify-center text-black font-black text-xs">
              BM
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide text-white leading-tight">
                BHART MART Admin Control
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                ● LIVE OWNER MODE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition cursor-pointer border border-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C59B27]' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-rose-400 bg-white/5 hover:bg-white/10 rounded-xl transition cursor-pointer border border-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>.
      </header>

      {/* 2. NAVIGATION TABS */}
      <div className="bg-[#141A28] border-b border-gray-800 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" /> Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Overview & Sales ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('themeEngine')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'themeEngine'
                ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/30'
                : 'text-amber-400 hover:text-white bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <Palette className="w-4 h-4" /> Store Customizer ✨
          </button>

          <button
            onClick={() => setActiveTab('logoFavicon')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'logoFavicon'
                ? 'bg-[#E57A00] text-white shadow-lg shadow-[#E57A00]/30'
                : 'text-[#E57A00] hover:text-white bg-[#E57A00]/10 border border-[#E57A00]/30'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Logo & Favicon
          </button>

          <button
            onClick={() => setActiveTab('soundSettings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'soundSettings'
                ? 'bg-[#ea580c] text-white shadow-lg shadow-[#ea580c]/30'
                : 'text-orange-400 hover:text-white bg-orange-500/10 border border-orange-500/30'
            }`}
          >
            <Volume2 className="w-4 h-4" /> Sound Settings
          </button>

          <button
            onClick={() => setActiveTab('adminSecurity')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'adminSecurity'
                ? 'bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30'
                : 'text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin Security & Settings
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Headphones className="w-4 h-4 text-sky-300" /> Support Inbox ({supportTickets.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <TicketPercent className="w-4 h-4 text-orange-300" /> Coupons & Discounts ({coupons.length})
          </button>

          <button
            onClick={() => setActiveTab('stockControl')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'stockControl'
                ? 'bg-[#ea580c] text-white shadow-lg shadow-[#ea580c]/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Boxes className="w-4 h-4" /> Stock Control
          </button>

          <button
            onClick={() => setActiveTab('heroCarousel')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'heroCarousel'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Film className="w-4 h-4 text-indigo-300" /> Hero Carousel ({heroBanners.length})
          </button>

          <button
            onClick={() => setActiveTab('limitedStock')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'limitedStock'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" /> Limited Stock Control
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Grid className="w-4 h-4" /> Category System ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('shopByCat')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'shopByCat'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Shop By Category ({shopCategories.length})
          </button>

          <button
            onClick={() => setActiveTab('reviewsModeration')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'reviewsModeration'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Reviews Moderation ({customerReviews.length})
          </button>
        </div>

        <div className="relative hidden md:block w-72 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search orders, stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C59B27]"
          />
        </div>
      </div>

      {/* 3. MAIN DETAILED BODY */}
      <main 
  className="flex-1 w-full overflow-y-scroll overscroll-contain p-4 sm:p-8 bg-[#0B0F17] flex flex-col items-center" 
  style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
>
        {activeTab === 'products' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141A28] p-5 rounded-3xl border border-gray-800 shadow-xl">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">Product Catalog Management</h2>
                <p className="text-xs text-gray-400 mt-0.5">Add new products, edit pricing, update images & stock levels</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={loadAllData}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync Catalog to Database
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductCard(!showAddProductCard)}
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#ea580c]/30 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {showAddProductCard ? 'Close Form' : 'Add New Product'}
                </button>
              </div>
            </div>

            {showAddProductCard && (
              <form onSubmit={handleSaveProduct} className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-5 shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-orange-400" /> Add New Product to BHART MART Catalog
                  </h3>
                  <button type="button" onClick={() => setShowAddProductCard(false)}>
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wireless Bluetooth Soundbar"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="">Select Category</option>
                      {combinedCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Shipping Charge (₹) *</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={shippingCharge}
                      onChange={(e) => setShippingCharge(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Original Price / MRP (₹) *</label>
                    <input
                      type="number"
                      placeholder="1999"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">
                    Selling Price (₹) (Optional — for discounts) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1499"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-400">
                      Primary Cover Image or Video *
                    </label>

                    <label className="px-3.5 py-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> {uploadingPrimary ? 'Uploading...' : 'Upload File from Device'}
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        onChange={handleUploadPrimaryMedia}
                        disabled={uploadingPrimary}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Paste image URL (e.g. https://... or unsplash link) or upload file above"
                    value={primaryMediaUrl}
                    onChange={(e) => setPrimaryMediaUrl(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500 font-mono"
                  />

                  {primaryMediaUrl && (
                    <div className="mt-2 p-2 bg-[#0B0F17] rounded-xl border border-gray-800 flex items-center gap-3">
                      {isVideo(primaryMediaUrl) ? (
                        <video src={primaryMediaUrl} autoPlay loop muted className="w-16 h-16 object-cover rounded-lg border border-orange-500" />
                      ) : (
                        <img src={primaryMediaUrl} alt="Cover Preview" className="w-16 h-16 object-cover rounded-lg border border-orange-500" />
                      )}
                      <div>
                        <span className="text-[10px] font-black uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                          {isVideo(primaryMediaUrl) ? 'Cover Video Attached' : 'Cover Image Attached'}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono mt-1 truncate max-w-sm">{primaryMediaUrl}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-gray-400">
                      Additional Gallery Media (Images & Video URLs)
                    </label>

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition cursor-pointer flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> {uploadingGallery ? 'Uploading...' : 'Add Gallery Image'}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleUploadGalleryMedia}
                          disabled={uploadingGallery}
                          className="hidden"
                        />
                      </label>

                      <label className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition cursor-pointer flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" /> Add Gallery Video File
                        <input
                          type="file"
                          multiple
                          accept="video/mp4,video/webm"
                          onChange={handleUploadGalleryMedia}
                          disabled={uploadingGallery}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="https://.../image.jpg&#10;https://.../video.mp4"
                    value={additionalMediaUrls.join('\n')}
                    onChange={(e) => setAdditionalMediaUrls(e.target.value.split('\n').filter(Boolean))}
                    className="w-full text-xs p-3 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none focus:border-orange-500"
                  />

                  {additionalMediaUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-[#0B0F17] rounded-xl border border-gray-800">
                      {additionalMediaUrls.map((url, idx) => (
                        <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-gray-700">
                          {isVideo(url) ? (
                            <video src={url} muted className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => setAdditionalMediaUrls(additionalMediaUrls.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>
                      ))}
                      <span className="text-[10px] text-gray-500 flex items-center pl-2">
                        {additionalMediaUrls.length} media attached
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed product specifications..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0B0F17] border border-gray-700 rounded-2xl">
  <div>
    <span className="text-xs font-bold text-white block">Enable Size Selection (S, M, L, XL, XXL)</span>
    <span className="text-[10px] text-gray-400 block">Dryer ya electronics ke liye OFF rakhein, Kapde/Jooton ke liye ON karein</span>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={hasSizes}
      onChange={(e) => setHasSizes(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ea580c]"></div>
  </label>
</div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isTrendingCheck"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                  />
                  <label htmlFor="isTrendingCheck" className="text-xs font-bold text-gray-300 cursor-pointer">
                    Mark as Trending Product (Featured on Home Page)
                  </label>
                </div>

                <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddProductCard(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct || uploadingPrimary || uploadingGallery}
                    className="px-7 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#ea580c]/30 cursor-pointer"
                  >
                    {savingProduct ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#141A28] border border-gray-800 rounded-3xl overflow-hidden shadow-xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                <h3 className="text-sm font-black text-white">Active Catalog Products ({products.length})</h3>
                <span className="text-[11px] text-gray-400">Real-time unified state synced across Supabase</span>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#111622] text-gray-400 font-bold uppercase text-[10px] border-b border-gray-800">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Media</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td className="p-3.5 flex items-center gap-3">
                          {isVideo(prod.image_url) ? (
                            <video src={prod.image_url} muted className="w-10 h-10 rounded-lg object-cover border border-gray-700" />
                          ) : (
                            <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-gray-700" />
                          )}
                          <span className="font-bold text-white text-xs">{prod.name}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-400">{prod.category}</span>
                        </td>
                        <td className="p-3.5 font-black text-[#C59B27]">₹{prod.price}</td>
                        <td className="p-3.5">{prod.stock} Units</td>
                        <td className="p-3.5 text-gray-400">
                          {prod.gallery_images?.length ? `${prod.gallery_images.length} items` : '1 media'}
                        </td>
                        <td className="p-3.5 text-right">
                          <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 text-gray-400 hover:text-rose-400 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#141A28] border border-gray-800 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Sales</span>
                <h3 className="text-2xl font-black text-white mt-2">₹{totalSales.toLocaleString('en-IN')}</h3>
              </div>
              <div className="p-5 bg-[#141A28] border border-gray-800 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
                <h3 className="text-2xl font-black text-white mt-2">{orders.length}</h3>
              </div>
              <div className="p-5 bg-[#141A28] border border-gray-800 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase">Catalog Items</span>
                <h3 className="text-2xl font-black text-white mt-2">{products.length}</h3>
              </div>
              <div className="p-5 bg-[#141A28] border border-gray-800 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase">Low Stock Alerts</span>
                <h3 className="text-2xl font-black text-white mt-2">{products.filter((p) => Number(p.stock) <= 5).length}</h3>
              </div>
            </div>

            <div className="bg-[#141A28] border border-gray-800 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-gray-800 pb-3">
  <h2 className="text-sm font-black text-white uppercase tracking-wider">
    Recent Customer Orders & Delivery Tracker ({filteredOrders.length})
  </h2>

  {/* ORDER FILTER DROPDOWN */}
  <select
    value={orderFilter}
    onChange={(e) => setOrderFilter(e.target.value)}
    className="text-xs font-bold bg-[#111622] text-[#C59B27] border border-gray-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
  >
    <option value="All">All Status</option>
    <option value="Pending">Confirmed</option>
    <option value="Shipped">Shipped</option>
    <option value="Out For Delivery">Out For Delivery</option>
    <option value="Delivered">Delivered</option>
  </select>
</div>
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No orders found.</p>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-[#111622] border border-gray-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-[#C59B27]">#{order.id.slice(0, 8)}</span>
                        <h4 className="text-xs font-black text-white">{order.customer_name} (+91 {order.phone})</h4>
                        <p className="text-[11px] text-gray-400">{order.address}, {order.pincode}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-white">₹{order.total_amount} (COD)</span>
                        <select
                          value={order.status || 'Pending'}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs font-bold bg-[#0B0F17] text-[#C59B27] border border-gray-700 rounded-lg p-2"
                        >
                          <option value="Pending">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      {activeTab === 'themeEngine' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-gradient-to-r from-amber-500 to-rose-500 text-black rounded-xl font-bold">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-white">Store Theme & Typography Customizer</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Change brand colors, Google fonts, gradient styles, layout & CSS. Live broadcast directly to all visiting shoppers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetTheme}
                className="px-4 py-2.5 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition cursor-pointer"
              >
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveThemeSettings}
                disabled={isSavingTheme}
                className="px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-xl transition bg-gradient-to-r from-amber-500 to-rose-500 text-black"
              >
                {themeSaveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {themeSaveSuccess ? 'Live Theme Saved!' : isSavingTheme ? 'Publishing...' : 'Save Theme Settings'}
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" /> Pre-made Professional Themes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PRESET_THEMES.map((preset) => {
                const isSelected = localTheme.activePreset === preset.name;
                return (
                  <div
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-[#111622] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white">{preset.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-black uppercase bg-amber-500 text-black px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{preset.desc}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      {preset.preview.map((hex, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-rose-400" /> Advanced Color Palette
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Background Color', key: 'background' },
                  { label: 'Card / Panel Background', key: 'cardBg' },
                  { label: 'Primary Brand Accent', key: 'primary' },
                  { label: 'Secondary Accent', key: 'secondary' },
                  { label: 'Primary Text Color', key: 'textPrimary' },
                  { label: 'Muted Text Color', key: 'textMuted' },
                  { label: 'Border & Divider Color', key: 'borderColor' },
                ].map(({ label, key }) => (
                  <div
                    key={key}
                    className="p-3 bg-[#111622] border border-gray-800 rounded-xl flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-gray-300">{label}</span>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={(localTheme.colors as any)[key] || '#ffffff'}
                        onChange={(e) => {
                          const updated = {
                            ...localTheme,
                            colors: { ...localTheme.colors, [key]: e.target.value },
                          };
                          setLocalTheme(updated);
                          updateTheme(updated);
                        }}
                        className="w-8 h-8 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-xs text-gray-400 uppercase w-16 text-right">
                        {(localTheme.colors as any)[key] || 'AUTO'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-sky-400" /> Professional Typography
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
                    Headings Font Family (H1, H2, Titles)
                  </label>
                  <select
                    value={localTheme.typography.headingFont}
                    onChange={(e) => {
                      const updated = {
                        ...localTheme,
                        typography: { ...localTheme.typography, headingFont: e.target.value },
                      };
                      setLocalTheme(updated);
                      updateTheme(updated);
                    }}
                    className="w-full text-xs p-3 rounded-xl bg-[#111622] border border-gray-700 text-white font-bold"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
                    Body Font Family (Paragraphs, Labels, UI)
                  </label>
                  <select
                    value={localTheme.typography.bodyFont}
                    onChange={(e) => {
                      const updated = {
                        ...localTheme,
                        typography: { ...localTheme.typography, bodyFont: e.target.value },
                      };
                      setLocalTheme(updated);
                      updateTheme(updated);
                    }}
                    className="w-full text-xs p-3 rounded-xl bg-[#111622] border border-gray-700 text-white font-bold"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" /> Advanced Gradient Controls
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">From Color</label>
                      <div className="flex items-center gap-2 bg-[#111622] p-2 rounded-xl border border-gray-800">
                        <input
                          type="color"
                          value={localTheme.gradients.fromColor}
                          onChange={(e) => {
                            const updated = {
                              ...localTheme,
                              gradients: { ...localTheme.gradients, fromColor: e.target.value },
                            };
                            setLocalTheme(updated);
                            updateTheme(updated);
                          }}
                          className="w-7 h-7 rounded border border-gray-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-xs text-gray-300">{localTheme.gradients.fromColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">To Color</label>
                      <div className="flex items-center gap-2 bg-[#111622] p-2 rounded-xl border border-gray-800">
                        <input
                          type="color"
                          value={localTheme.gradients.toColor}
                          onChange={(e) => {
                            const updated = {
                              ...localTheme,
                              gradients: { ...localTheme.gradients, toColor: e.target.value },
                            };
                            setLocalTheme(updated);
                            updateTheme(updated);
                          }}
                          className="w-7 h-7 rounded border border-gray-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-xs text-gray-300">{localTheme.gradients.toColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-purple-400" /> Section Visibility & Borders
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Hero Banner Slider', key: 'showHero' },
                  { label: 'Limited Stock Drops', key: 'showLimitedStock' },
                  { label: 'Pill Categories Bar', key: 'showCategories' },
                  { label: 'Shop By Category Grid', key: 'showShopByCat' },
                  { label: 'Store Footer Guarantee', key: 'showFooter' },
                  { label: 'Glassmorphism Cards', key: 'glassmorphism' },
                ].map(({ label, key }) => {
                  const active = (localTheme.sections as any)[key];
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        const updated = {
                          ...localTheme,
                          sections: { ...localTheme.sections, [key]: !active },
                        };
                        setLocalTheme(updated);
                        updateTheme(updated);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        active ? 'bg-purple-500/10 border-purple-500/40 text-white' : 'bg-[#111622] border-gray-800 text-gray-400'
                      }`}
                    >
                      <span className="text-xs font-bold">{label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" /> Custom CSS Rules
              </h3>
              <textarea
                rows={5}
                value={localTheme.customCss}
                onChange={(e) => {
                  const updated = { ...localTheme, customCss: e.target.value };
                  setLocalTheme(updated);
                  updateTheme(updated);
                }}
                placeholder="/* Real-time custom CSS injected globally */"
                className="w-full font-mono text-xs p-3 rounded-xl bg-[#0B0F17] border border-gray-700 text-emerald-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logoFavicon' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-[#E57A00]">
                <ImageIcon className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-black text-white">
                  Logo Management & Background Blending
                </h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Upload from device, paste URL, drag & drop. Responsive size sliders (10px–300px), dual-way real-time header sync.
              </p>
            </div>

            <button
  type="button"
 onClick={async () => {
  if (!logoUrl) {
    alert('Please choose or upload a logo image first!');
    return;
  }
  try {
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({
        id: 'global_config',
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    localStorage.setItem('bm_custom_logo', logoUrl);
    window.dispatchEvent(new Event('storage'));

    alert('✓ Logo Globally Sabhi Devices Ke Liye Save Ho Gaya!');
  } catch (err: any) {
    alert('Save Error: ' + err.message);
  }
}}
  className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition active:scale-95 shrink-0"
>
  <Save className="w-4 h-4" /> Save Settings
</button>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-6">
            <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C59B27]" /> Storefront Logo — Upload or Paste URL
            </h3>

            <label className="border-2 border-dashed border-gray-700 hover:border-[#C59B27] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#0B0F17]/50 group">
              <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-white">Click to upload or drag & drop your logo here</span>
              <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, SVG, WEBP • Max 5MB</span>
            </label>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                LOGO IMAGE URL (HTTPS, PNG, SVG, WEBP, DATA URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="/logo.png or https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white focus:outline-none focus:border-[#C59B27] font-mono"
                />
                <button
                  type="button"
                  onClick={() => { if (!logoUrl) alert('Please enter image URL'); }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 border border-gray-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Test
                </button>
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-rose-400 border border-gray-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-400">LOGO WIDTH: <strong className="text-amber-400">{logoWidth}PX</strong></span>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={logoWidth}
                    onChange={(e) => setLogoWidth(Number(e.target.value))}
                    className="w-16 text-center text-xs py-1 rounded-lg bg-[#0B0F17] border border-gray-700 text-white font-mono"
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={logoWidth}
                  onChange={(e) => setLogoWidth(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-400">LOGO HEIGHT: <strong className="text-amber-400">{logoHeight}PX</strong></span>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={logoHeight}
                    onChange={(e) => setLogoHeight(Number(e.target.value))}
                    className="w-16 text-center text-xs py-1 rounded-lg bg-[#0B0F17] border border-gray-700 text-white font-mono"
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Background Blend Mode</label>
                <select
                  value={blendMode}
                  onChange={(e) => setBlendMode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                >
                  <option value="multiply">Multiply (Blends White Background - Recommended)</option>
                  <option value="normal">Normal (Standard Image)</option>
                  <option value="screen">Screen (Blends Dark Background)</option>
                  <option value="darken">Darken Only</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Object Fit</label>
                <select
                  value={objectFit}
                  onChange={(e) => setObjectFit(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                >
                  <option value="contain">Contain (Preserve Aspect)</option>
                  <option value="cover">Cover (Fill Area)</option>
                  <option value="fill">Fill (Stretch)</option>
                  <option value="scale-down">Scale Down</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span>Brightness:</span>
                  <span className="text-white">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full mt-2 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="invertCheck"
                  checked={invert}
                  onChange={(e) => setInvert(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="invertCheck" className="text-xs font-bold text-gray-300 cursor-pointer">
                  Invert Colors (Dark Header)
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#C59B27]" /> Favicon (Browser Tab Icon)
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0F17] border border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="Favicon" className="w-7 h-7 object-contain" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Favicon Image URL</label>
                <input
                  type="url"
                  placeholder="https://.../favicon.ico or png"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-3">
            <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" /> Transparent Theme Logo Preview ({logoWidth}px × {logoHeight}px)
            </h3>
            <div className="p-6 bg-white rounded-2xl border border-gray-200 flex items-center gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Preview Logo"
                  style={{
                    width: `${logoWidth}px`,
                    height: `${logoHeight}px`,
                    objectFit: objectFit as any,
                    mixBlendMode: blendMode as any,
                    filter: `brightness(${brightness}%)${invert ? ' invert(1)' : ''}`,
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-black text-[#C59B27] font-black rounded-xl flex items-center justify-center text-sm">
                  BM
                </div>
              )}
              <div>
                <h4 className="text-sm font-black text-gray-900 tracking-tight">BHARATMART</h4>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">
                  Curated Collections Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'soundSettings' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-orange-400" /> Sound & Notification Settings
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Customize audio feedback for customer actions: like/wishlist, add to cart, and order success.
              </p>
            </div>

            {themeSaveSuccess && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Live Synced!
              </span>
            )}
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <h3 className="text-sm font-black text-white">Enable Sound Effects Globally</h3>
              <p className="text-xs text-gray-400 mt-0.5">Toggle all sound effects on or off across the entire store</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                handleSaveSoundSettings();
              }}
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                soundEnabled ? 'bg-[#ea580c]' : 'bg-gray-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {[
            { title: 'Like / Wishlist Sound', desc: 'Plays when customer clicks the heart icon', val: wishlistSound, setter: setWishlistSound },
            { title: 'Add to Cart Sound', desc: 'Plays when customer adds a product to cart', val: cartSound, setter: setCartSound },
            { title: 'Order Success Sound', desc: 'Plays when an order is successfully placed', val: orderSound, setter: setOrderSound },
          ].map(({ title, desc, val, setter }, i) => (
            <div key={i} className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white">{title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestAudio(val)}
                  className="px-3 py-1.5 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 text-xs font-bold text-sky-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Test
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveSoundSettings}
                  className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'adminSecurity' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">Cash on Delivery (COD) Payment Status</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${codEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {codEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Enable or disable Cash on Delivery payment option during customer checkout</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCodEnabled(!codEnabled);
                  handleSaveSecuritySettings();
                }}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition duration-300 shrink-0 ${
                  codEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                    codEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-[#0B0F17] rounded-xl border border-gray-800 text-[11px] text-amber-400/90 font-medium">
              💡 Instant Effect: When disabled, Cash on Delivery is hidden at checkout and COD badges are hidden on product pages.
            </div>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Online Payment Gateway & QR Code Settings</h3>
                <p className="text-xs text-gray-400 mt-0.5">Configure store UPI ID, Gateway Phone/UPI Number, and Custom QR Code image</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Gateway UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="vedantgadewar291-1@okicici"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Gateway Phone / UPI Number</label>
                <input
                  type="text"
                  value={gatewayPhone}
                  onChange={(e) => setGatewayPhone(e.target.value)}
                  placeholder="+91 90224 82630"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Custom Payment QR Code Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  placeholder="https://... (or upload image file below)"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none"
                />
                <label className="px-4 py-2.5 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 text-xs font-bold text-orange-400 flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Upload QR Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const r = new FileReader();
                        r.onloadend = () => setQrCodeUrl(r.result as string);
                        r.readAsDataURL(f);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 bg-[#0B0F17] border border-gray-800 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=BHARTMART`)}`}
                    alt="Dynamic UPI QR"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                <span className="text-[9px] font-black uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                  LIVE PREVIEW
                </span>
                <h4 className="text-xs font-black text-white mt-1">Using Dynamic Auto-Generated QR Code</h4>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">UPI: {upiId}</p>
                <p className="text-[10px] text-gray-400 font-mono">Phone: {gatewayPhone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSecuritySettings}
              className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Save Online Gateway Settings
            </button>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">Homepage "Limited Stock Only" Showcase</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${showcaseEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                      {showcaseEnabled ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Customize showcase title, subtitle, and assign specific featured products</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowcaseEnabled(!showcaseEnabled);
                  handleSaveSecuritySettings();
                }}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition duration-300 shrink-0 ${
                  showcaseEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                    showcaseEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Showcase Headline Title</label>
              <input
                type="text"
                value={showcaseTitle}
                onChange={(e) => setShowcaseTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Showcase Subtitle Description</label>
              <input
                type="text"
                value={showcaseSubtitle}
                onChange={(e) => setShowcaseSubtitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveSecuritySettings}
              className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Save Showcase Settings
            </button>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Update Admin Email</h3>
                <p className="text-xs text-gray-400 mt-0.5">Change the authorized email used to access this admin dashboard</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">New Admin Email</label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Current Password (verify)</label>
              <input
                type="password"
                value={verifyPasswordForEmail}
                onChange={(e) => setVerifyPasswordForEmail(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateAdminEmail}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl cursor-pointer"
            >
              Update Admin Email
            </button>
          </div>

          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Set Custom Admin Password</h3>
                <p className="text-xs text-gray-400 mt-0.5">Change password used by owners/team members to unlock this admin dashboard</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">New Admin Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateAdminPassword}
              className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Update Admin Password
            </button>
          </div>
        </div>
      )}

      {activeTab === 'reviewsModeration' && (
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="p-5 bg-[#141A28] border border-gray-800 rounded-3xl flex justify-between items-center shadow-xl">
            <div>
              <h3 className="text-sm font-black text-white">Product Customer Reviews & Photos ({customerReviews.length})</h3>
              <p className="text-xs text-gray-400">Moderate feedback submitted by verified customers</p>
            </div>
          </div>

          <div className="bg-[#141A28] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#111622] text-gray-400 font-bold uppercase text-[10px] border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Review Comment</th>
                  <th className="p-3.5">Customer Photo</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {customerReviews.map((rev) => (
                  <tr key={rev.id}>
                    <td className="p-3.5 font-bold text-white">{rev.customer_name}</td>
                    <td className="p-3.5 text-amber-400 font-bold">★ {rev.rating}/5</td>
                    <td className="p-3.5 max-w-xs truncate">{rev.comment}</td>
                    <td className="p-3.5">
                      {rev.image_url ? (
                        <img src={rev.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-700" />
                      ) : (
                        <span className="text-gray-500">No photo</span>
                      )}
                    </td>
                    <td className="p-3.5 text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => handleDeleteReview(rev.id)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex flex-wrap justify-between items-center gap-4 shadow-xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Headphones className="w-5 h-5 text-sky-400" /> Customer Support Messages Inbox
              </h2>
              <p className="text-xs text-gray-400 mt-1">Real-time incoming customer tickets and inquiry resolution desk</p>
            </div>

            <div className="flex gap-2">
              {(['All', 'Open', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSupportFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    supportFilter === filter ? 'bg-sky-600 text-white' : 'bg-[#111622] text-gray-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSupportTickets.length === 0 ? (
              <div className="p-16 text-center bg-[#141A28] border border-gray-800 rounded-3xl text-gray-500 text-xs">
                No support messages found.
              </div>
            ) : (
              filteredSupportTickets.map((t) => (
                <div key={t.id} className="p-5 bg-[#141A28] border border-gray-800 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-xs">{t.name}</span>
                      <a href={`tel:${t.mobile}`} className="text-sky-400 text-xs font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" /> +91 {t.mobile}
                      </a>
                      <span className="text-gray-500 text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(t.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 block">{t.subject}</span>
                    <p className="text-xs text-gray-300 p-3 bg-[#0B0F17] rounded-xl border border-gray-800">{t.message}</p>
                  </div>
                  <div className="flex md:flex-col justify-between items-end gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {t.status}
                    </span>
                    <button onClick={() => handleToggleTicketStatus(t.id, t.status)} className="text-xs px-3.5 py-1.5 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 cursor-pointer">
                      Mark {t.status === 'Open' ? 'Resolved' : 'Open'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex justify-between items-center shadow-xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-orange-400" /> Coupons & Discounts Management
              </h2>
              <p className="text-xs text-gray-400 mt-1">Create custom coupon codes with fixed (₹) or percentage (%) discounts</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-600/30 transition"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>

          {showAddCoupon && (
            <form onSubmit={handleCreateCoupon} className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BHARAT10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 10% off"
                    value={couponDesc}
                    onChange={(e) => setCouponDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                  >
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={discountVal}
                    onChange={(e) => setDiscountVal(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderVal}
                    onChange={(e) => setMinOrderVal(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCouponActive"
                  checked={isCouponActive}
                  onChange={(e) => setIsCouponActive(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <label htmlFor="isCouponActive" className="text-xs font-bold text-white cursor-pointer">
                  Active (Customers can apply immediately)
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={savingCoupon} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl cursor-pointer">
                  Save Coupon
                </button>
                <button type="button" onClick={() => setShowAddCoupon(false)} className="px-5 py-2.5 bg-white/5 text-gray-300 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#141A28] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#111622] text-gray-400 font-bold uppercase text-[10px] border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Value</th>
                  <th className="p-3.5">Min Order</th>
                  <th className="p-3.5">Expiry</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3.5 font-mono font-bold text-orange-400">{c.code}</td>
                    <td className="p-3.5 capitalize">{c.discount_type}</td>
                    <td className="p-3.5 font-black text-white">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                    <td className="p-3.5">₹{c.min_order_value || 0}</td>
                    <td className="p-3.5 text-gray-400">{c.expiry_date || 'No Expiry'}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleCouponStatus(c.id, c.is_active)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                          c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => handleDeleteCoupon(c.id)} className="text-gray-400 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stockControl' && (
        <div className="w-full max-w-6xl mx-auto space-y-6 pb-48">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl shadow-xl">
            <h2 className="text-lg font-black text-white">Live Inventory & Stock Control</h2>
            <p className="text-xs text-gray-400 mt-1">Quickly adjust stock units directly</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStockProducts.map((p) => (
              <div key={p.id} className="p-4 bg-[#141A28] border border-gray-800 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-700" />
                  <div>
                    <h4 className="text-xs font-black text-white truncate max-w-[130px]">{p.name}</h4>
                    <span className="text-xs text-[#C59B27] font-bold">₹{p.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStock(p.id, (Number(p.stock) || 0) - 1)}
                    className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center font-bold border border-gray-700 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-7 text-center">{p.stock}</span>
                  <button
                    onClick={() => handleUpdateStock(p.id, (Number(p.stock) || 0) + 1)}
                    className="w-7 h-7 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center font-bold border border-amber-500/40 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'heroCarousel' && (
        <div className="max-w-6xl mx-auto space-y-6 w-full">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl shadow-xl">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-400" /> Hero Banner Carousel Management
            </h2>
            <p className="text-xs text-gray-400 mt-1">Manage main top banners with tags, titles, and media links</p>
          </div>

          <form onSubmit={handleAddHeroBanner} className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">+ Add New Banner Slide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Slide Title (e.g. MONOCHROME STREETWEAR 2026)"
                value={newBannerTitle}
                onChange={(e) => setNewBannerTitle(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Slide Subtitle"
                value={newBannerSubtitle}
                onChange={(e) => setNewBannerSubtitle(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tag (e.g. NEW DROP LIVE)"
                value={newBannerTag}
                onChange={(e) => setNewBannerTag(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Button Text"
                value={newBannerCta}
                onChange={(e) => setNewBannerCta(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Target Category"
                value={newBannerCategory}
                onChange={(e) => setNewBannerCategory(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white"
              />
            </div>
            <input
              type="url"
              required
              placeholder="Media Image URL"
              value={newBannerMediaUrl}
              onChange={(e) => setNewBannerMediaUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono"
            />
            <button type="submit" disabled={isSavingBanner} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer">
              Add Slide
            </button>
          </form>

          <div className="space-y-3">
            {heroBanners.map((slide) => (
              <div key={slide.id} className="p-4 bg-[#141A28] border border-gray-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={slide.media_url} alt={slide.title} className="w-16 h-10 object-cover rounded-lg border border-gray-700" />
                  <div>
                    <span className="text-[10px] font-black text-[#C59B27] uppercase">{slide.tag}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{slide.title}</h4>
                  </div>
                </div>
                <button onClick={() => handleDeleteHeroBanner(slide.id)} className="text-rose-400 text-xs hover:underline cursor-pointer">
                  Remove Slide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'limitedStock' && (
        <div className="w-full max-w-6xl mx-auto space-y-6 pb-48">
          <div className="p-6 bg-[#141A28] border border-gray-800 rounded-3xl flex justify-between items-center shadow-xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" /> Limited Stock Showcase Control Hub
              </h2>
              <p className="text-xs text-gray-400 mt-1">Select items for the special limited urgency drop ribbon</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowcaseActive(!showcaseActive)}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${showcaseActive ? 'bg-emerald-500 text-black' : 'bg-gray-700'}`}
              >
                {showcaseActive ? 'ACTIVE' : 'OFF'}
              </button>
              <button onClick={handleSaveShowcase} disabled={savingShowcase} className="px-5 py-2 bg-amber-500 text-black font-black text-xs rounded-xl cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => {
              const isSelected = selectedProductIds.includes(String(p.id));
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProductSelection(String(p.id))}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-amber-500/10 border-amber-500' : 'bg-[#141A28] border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <span className="text-xs font-bold text-white truncate max-w-[130px] block">{p.name}</span>
                      <span className="text-[10px] text-gray-400">Stock: {p.stock}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center bg-[#141A28] p-5 rounded-3xl border border-gray-800 shadow-xl">
            <h3 className="text-sm font-black text-white">Dynamic Custom Category Management ({categories.length})</h3>
            <button onClick={() => setShowAddCategoryModal(true)} className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
              + Add Category
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-3 bg-[#141A28] border border-gray-800 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.name}</span>
                <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-400 text-xs cursor-pointer">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shopByCat' && (
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center bg-[#141A28] p-5 rounded-3xl border border-gray-800 shadow-xl">
            <h3 className="text-sm font-black text-white">Shop By Category Manager ({shopCategories.length})</h3>
            <button onClick={() => setShowAddShopCatModal(true)} className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
              + Add Category Card
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {shopCategories.map((sc) => (
              <div key={sc.id} className="p-3 bg-[#141A28] border border-gray-800 rounded-2xl overflow-hidden">
                <img src={sc.image_url} alt={sc.title} className="w-full h-28 object-cover rounded-xl mb-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase">{sc.title}</span>
                  <button onClick={() => handleDeleteShopCategory(sc.id)} className="text-rose-400 text-xs cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'navButtons' && (
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center bg-[#141A28] p-5 rounded-3xl border border-gray-800 shadow-xl">
            <h3 className="text-sm font-black text-white">Navigation Header Category Buttons ({navButtons.length})</h3>
            <button onClick={() => setShowAddNavModal(true)} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
              + Add Nav Button
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {navButtons.map((btn) => (
              <div key={btn.id} className="p-4 bg-[#141A28] border border-gray-800 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">{btn.label}</span>
                <button onClick={() => handleDeleteNavButton(btn.id)} className="text-rose-400 text-xs cursor-pointer">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
      </main>

      {showAddCategoryModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#141A28] rounded-3xl p-6 border border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">Create New Category</h3>
              <button onClick={() => setShowAddCategoryModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <input type="text" required placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <input type="url" required placeholder="Category Image URL" value={catImageUrl} onChange={(e) => setCatImageUrl(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <button type="submit" disabled={savingCategory} className="w-full py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl cursor-pointer">Save Category</button>
            </form>
          </div>
        </div>
      )}

      {showAddShopCatModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#141A28] rounded-3xl p-6 border border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">Add Shop By Category Card</h3>
              <button onClick={() => setShowAddShopCatModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateShopCategory} className="space-y-3">
              <input type="text" required placeholder="Card Title" value={shopCatTitle} onChange={(e) => setShopCatTitle(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <input type="url" required placeholder="Image URL" value={shopCatImage} onChange={(e) => setShopCatImage(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <input type="text" placeholder="Filter Link (optional)" value={shopCatLink} onChange={(e) => setShopCatLink(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <button type="submit" disabled={savingShopCat} className="w-full py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer">Save Card</button>
            </form>
          </div>
        </div>
      )}

      {showAddNavModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#141A28] rounded-3xl p-6 border border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">Add Header Nav Button</h3>
              <button onClick={() => setShowAddNavModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateNavButton} className="space-y-3">
              <input type="text" required placeholder="Label (e.g. Footwear)" value={navLabel} onChange={(e) => setNavLabel(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <input type="text" placeholder="Key (optional)" value={navKey} onChange={(e) => setNavKey(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white" />
              <button type="submit" disabled={savingNav} className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer">Save Button</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};