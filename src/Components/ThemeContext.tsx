import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface LogoConfig {
  logoUrl: string;
  faviconUrl: string;
  width: number;
  height: number;
  blendMode: string;
  objectFit: string;
  brightness: number;
  invert: boolean;
}

export interface SoundConfig {
  enabled: boolean;
  wishlistSound: string;
  cartSound: string;
  orderSound: string;
}

export interface SecurityConfig {
  codEnabled: boolean;
  upiId: string;
  gatewayPhone: string;
  qrCodeUrl: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseEnabled: boolean;
  adminEmail: string;
  adminPass: string;
}

export interface ThemeConfig {
  activePreset: string;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
  colors: {
    background: string;
    cardBg: string;
    primary: string;
    secondary: string;
    textPrimary: string;
    textMuted: string;
    borderColor: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontScale: number;
  };
  gradients: {
    enabled: boolean;
    fromColor: string;
    toColor: string;
    angle: number;
  };
  sections: {
    showHero: boolean;
    showLimitedStock: boolean;
    showCategories: boolean;
    showShopByCat: boolean;
    showFooter: boolean;
    cardBorderRadius: number;
    glassmorphism: boolean;
  };
  customCss: string;
  logoSettings: LogoConfig;
  soundSettings: SoundConfig;
  securitySettings: SecurityConfig;
}

export const defaultTheme: ThemeConfig = {
  activePreset: 'Classic Store',
  backgroundImage: '',
  backgroundOverlayOpacity: 0.1,
  colors: {
    background: '#0B0F17',
    cardBg: '#141A28',
    primary: '#C59B27',
    secondary: '#E5B842',
    textPrimary: '#FFFFFF',
    textMuted: '#9CA3AF',
    borderColor: '#374151',
  },
  typography: {
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    fontScale: 1,
  },
  gradients: {
    enabled: true,
    fromColor: '#C59B27',
    toColor: '#E5B842',
    angle: 135,
  },
  sections: {
    showHero: true,
    showLimitedStock: true,
    showCategories: true,
    showShopByCat: true,
    showFooter: true,
    cardBorderRadius: 16,
    glassmorphism: true,
  },
  customCss: '',
  logoSettings: {
    logoUrl: '',
    faviconUrl: '',
    width: 100,
    height: 100,
    blendMode: 'normal',
    objectFit: 'contain',
    brightness: 100,
    invert: false,
  },
  soundSettings: {
    enabled: true,
    wishlistSound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8e89a3a3a3.mp3',
    cartSound: 'https://cdn.pixabay.com/audio/2021/10/25/audio_6f6a3a3a3a.mp3',
    orderSound: 'https://cdn.pixabay.com/audio/2022/03/10/audio_9e7a3a3a3a.mp3',
  },
  securitySettings: {
    codEnabled: true,
    upiId: 'vedantgadewar291-1@okicici',
    gatewayPhone: '+91 90224 82630',
    qrCodeUrl: '',
    showcaseTitle: '🔥 LIMITED STOCK ONLY — SELLING FAST',
    showcaseSubtitle: 'Exclusive high-demand products with limited inventory. Grab yours before stock runs out!',
    showcaseEnabled: true,
    adminEmail: 'martbharat5@gmail.com',
    adminPass: 'mayved@2026',
  },
};

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  saveThemeToDb: (themeToSave: ThemeConfig) => Promise<boolean>;
  playSound: (type: 'wishlist' | 'cart' | 'order') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
  saveThemeToDb: async () => false,
  playSound: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const cached = localStorage.getItem('bm_theme_config');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          ...defaultTheme,
          ...parsed,
          soundSettings: { ...defaultTheme.soundSettings, ...(parsed.soundSettings || {}) },
          securitySettings: { ...defaultTheme.securitySettings, ...(parsed.securitySettings || {}) },
        };
      } catch {}
    }
    return defaultTheme;
  });

  const playSound = (type: 'wishlist' | 'cart' | 'order') => {
    if (!theme.soundSettings?.enabled) return;
    let url = '';
    if (type === 'wishlist') url = theme.soundSettings.wishlistSound;
    else if (type === 'cart') url = theme.soundSettings.cartSound;
    else if (type === 'order') url = theme.soundSettings.orderSound;

    if (url) {
      try {
        const audio = new Audio(url);
        audio.play().catch(() => {});
      } catch {}
    }
  };

  const applyThemeToDOM = (t: ThemeConfig) => {
    const root = document.documentElement;
    const body = document.body;

    if (t.colors.primary) root.style.setProperty('--bm-primary', t.colors.primary);
    if (t.colors.secondary) root.style.setProperty('--bm-secondary', t.colors.secondary);
    if (t.colors.background) root.style.setProperty('--bm-bg', t.colors.background);
    if (t.colors.cardBg) root.style.setProperty('--bm-card-bg', t.colors.cardBg);
    if (t.colors.textPrimary) root.style.setProperty('--bm-text', t.colors.textPrimary);
    if (t.colors.borderColor) root.style.setProperty('--bm-border', t.colors.borderColor);

    // Apply Background Wallpaper / Festival Image
    if (t.backgroundImage && t.backgroundImage.trim() !== '') {
      body.style.backgroundImage = `url("${t.backgroundImage}")`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
    } else {
      body.style.backgroundImage = 'none';
      if (t.colors.background) {
        body.style.backgroundColor = t.colors.background;
      }
    }

    if (t.logoSettings?.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = t.logoSettings.faviconUrl;
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('theme_data')
        .eq('id', 'theme_config')
        .maybeSingle();

      if (data && data.theme_data) {
        setTheme((prev) => ({
          ...prev,
          ...data.theme_data,
          soundSettings: { ...defaultTheme.soundSettings, ...(data.theme_data.soundSettings || {}) },
          securitySettings: { ...defaultTheme.securitySettings, ...(data.theme_data.securitySettings || {}) },
        }));
        localStorage.setItem('bm_theme_config', JSON.stringify(data.theme_data));
      }
    };

    fetchTheme();

    const channel = supabase
      .channel('theme_realtime_all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings', filter: 'id=eq.theme_config' },
        (payload: any) => {
          if (payload.new && payload.new.theme_data) {
            setTheme((prev) => ({
              ...prev,
              ...payload.new.theme_data,
              soundSettings: { ...defaultTheme.soundSettings, ...(payload.new.theme_data.soundSettings || {}) },
              securitySettings: { ...defaultTheme.securitySettings, ...(payload.new.theme_data.securitySettings || {}) },
            }));
            localStorage.setItem('bm_theme_config', JSON.stringify(payload.new.theme_data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateTheme = (newProps: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...newProps }));
  };

  const saveThemeToDb = async (themeToSave: ThemeConfig) => {
    try {
      const { error } = await supabase.from('store_settings').upsert({
        id: 'theme_config',
        theme_data: themeToSave,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      localStorage.setItem('bm_theme_config', JSON.stringify(themeToSave));
      return true;
    } catch (err) {
      console.error('Error saving theme:', err);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, saveThemeToDb, playSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);