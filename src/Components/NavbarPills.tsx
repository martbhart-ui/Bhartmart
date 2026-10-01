import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavbarPillsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const NavbarPills: React.FC<NavbarPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      if (data && data.length > 0) {
        setCategoriesList(data);
      } else {
        setCategoriesList([
          { id: '1', name: 'Footwear' },
          { id: '2', name: 'T-Shirts' },
          { id: '3', name: 'Hoodies' },
          { id: '4', name: 'Oversized' },
        ]);
      }
    } catch (err) {
      console.error('Fetch categories failed:', err);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Realtime sync jab bhi category add ya delete ho
    const channel = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className={`border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#0B0F17] border-gray-800'
          : 'bg-[#FDFBF7] border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* HOME / ALL ITEMS */}
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-black text-[#C59B27] shadow-sm border border-[#C59B27]/40'
                : isDarkMode
                ? 'bg-[#141A28] text-gray-300 hover:text-white border border-gray-800'
                : 'bg-white text-gray-700 hover:text-black border border-gray-200 shadow-2xs'
            }`}
          >
            Home
          </button>

          {/* DYNAMIC CATEGORY PILLS */}
          {categoriesList.map((cat) => {
            const catName = cat.name || cat.label || '';
            const isSelected =
              selectedCategory?.toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(catName)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-black text-[#C59B27] shadow-sm border border-[#C59B27]/40'
                    : isDarkMode
                    ? 'bg-[#141A28] text-gray-300 hover:text-white border border-gray-800'
                    : 'bg-white text-gray-700 hover:text-black border border-gray-200 shadow-2xs'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* NIGHT MODE TOGGLE BUTTON */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer shrink-0 border ${
            isDarkMode
              ? 'bg-[#141A28] text-[#E5B842] border-gray-700 hover:bg-white/10'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
          }`}
          title="Toggle Night Mode"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-gray-700" />
              <span>Night Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};