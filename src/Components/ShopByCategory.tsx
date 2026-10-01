import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ShopByCategoryProps {
  onSelectCategory: (category: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  const [items, setItems] = useState<any[]>([]);

  const fetchShopCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .select('*');

      if (error) {
        console.error('Error fetching shop_categories:', error);
        return;
      }

      if (data && data.length > 0) {
        setItems(data);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchShopCategories();

    const channel = supabase
      .channel('public:shop_categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shop_categories' },
        () => {
          fetchShopCategories();
        }
      )
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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.link_category || cat.title)}
            className="group relative h-56 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={cat.image_url}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
              <div>
                <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-md">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-gray-300 font-semibold flex items-center gap-1 mt-1 group-hover:text-[#C59B27] transition-colors">
                  Explore Collection <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};