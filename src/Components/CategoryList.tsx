import React from 'react';
import { handleImageError } from '../lib/supabase';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    { id: 'men', name: "Men's Wear", img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400' },
    { id: 'women', name: "Women's Wear", img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
    { id: 'tshirts', name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400' },
    { id: 'hoodies', name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
    { id: 'accessories', name: 'Accessories', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
    { id: 'footwear', name: 'Footwear', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { id: 'home', name: 'Home & Living', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400' },
    { id: 'beauty', name: 'Beauty & Care', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Title with decorative wings */}
      <div className="text-center mb-6">
        <span className="text-xs text-[#C59B27] uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2">
          <span>———</span> SHOP BY CATEGORY <span>———</span>
        </span>
      </div>

      {/* Categories Horizontal Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`flex flex-col items-center text-center cursor-pointer group p-2 rounded-xl transition ${
                isSelected ? 'bg-amber-50 ring-2 ring-[#C59B27]' : 'hover:bg-white'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-[#C59B27] transition shadow-sm mb-2">
                <img
                  src={cat.img}
                  alt={cat.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-[#C59B27] transition">
                {cat.name}
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">Explore Now</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};