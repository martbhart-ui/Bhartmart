import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles } from 'lucide-react';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();

    // Supabase Realtime Subscription for instant live sync
    const channel = supabase
      .channel('categories-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (data && data.length > 0) {
      setCategories(data);
    } else {
      // Default Fallback
      setCategories([
        { id: '1', name: 'All Products', image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
        { id: '2', name: 'Footwear', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: '3', name: 'Hoodies', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
        { id: '4', name: 'Anime Merch', image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
      ]);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C59B27]" /> Explore Categories
          </h3>
          <p className="text-xs text-gray-500">Pick a category to filter the collection</p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer"
          >
            Show All Items
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll / Grid */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer border ${
            selectedCategory === null
              ? 'bg-black text-white border-black shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory?.toLowerCase() === cat.name?.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`shrink-0 flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                isSelected
                  ? 'bg-[#C59B27] text-white border-[#C59B27] shadow-md'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-7 h-7 rounded-xl object-cover border border-gray-100 shrink-0"
              />
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};