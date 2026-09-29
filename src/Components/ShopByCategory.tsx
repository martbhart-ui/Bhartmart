import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ShopByCategoryProps {
  onSelectCategory: (category: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  const [items, setItems] = useState<any[]>([]);

  const fetchShopCategories = async () => {
    const { data } = await supabase
      .from('shop_categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setItems(data);
    } else {
      // Default starter items agar table khali ho
      setItems([
        {
          id: '1',
          title: 'OVERSIZED TEES',
          image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
          link_category: 'T-Shirts'
        },
        {
          id: '2',
          title: 'HOODIES & SWEATERS',
          image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500',
          link_category: 'Hoodies'
        },
        {
          id: '3',
          title: 'SNEAKERS & SHOES',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          link_category: 'Footwear'
        },
        {
          id: '4',
          title: 'STREET CARGOS',
          image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500',
          link_category: 'Bottoms'
        }
      ]);
    }
  };

  useEffect(() => {
    fetchShopCategories();

    // Supabase Realtime - instant live sync
    const channel = supabase
      .channel('realtime:shop_categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_categories' }, () => {
        fetchShopCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C59B27] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Curated Collections
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            SHOP BY CATEGORY
          </h2>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.link_category || cat.title)}
            className="group relative h-56 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            {/* Background Image */}
            <img
              src={cat.image_url}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Bottom Content */}
            <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
              <div>
                <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-md">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-gray-300 font-semibold flex items-center gap-1 mt-1 group-hover:text-[#C59B27] transition">
                  Explore Collection <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};