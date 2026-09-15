import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { handleImageError } from '../lib/supabase';

interface ProductGridProps {
  selectedCategory: string | null;
  searchTerm: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory, searchTerm }) => {
  const { products, addToCart } = useStore();

  const defaultProducts = [
    {
      id: 'p-1',
      name: 'Anime Graphic Oversized T-Shirt',
      category_id: 'tshirts',
      price: 349,
      original_price: 699,
      stock: 50,
      rating: 4.8,
      reviews_count: 128,
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'
    },
    {
      id: 'p-2',
      name: 'Naruto Graphic Hoodie - Black & Beige',
      category_id: 'hoodies',
      price: 599,
      original_price: 999,
      stock: 35,
      rating: 4.9,
      reviews_count: 96,
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600'
    },
    {
      id: 'p-3',
      name: 'Premium Zip Neck Sweatshirt',
      category_id: 'men',
      price: 549,
      original_price: 699,
      stock: 25,
      rating: 4.7,
      reviews_count: 78,
      image_url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600'
    },
    {
      id: 'p-4',
      name: 'Calvin Klein Printed T-Shirt',
      category_id: 'tshirts',
      price: 399,
      original_price: 799,
      stock: 45,
      rating: 4.9,
      reviews_count: 110,
      image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
    },
    {
      id: 'p-5',
      name: 'Sleeveless Gym & Casual Hoodie for Men',
      category_id: 'hoodies',
      price: 499,
      original_price: 899,
      stock: 30,
      rating: 4.6,
      reviews_count: 64,
      image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600'
    }
  ];

  const activeProducts = products && products.length > 0 ? products : defaultProducts;

  const filteredProducts = activeProducts.filter((p: any) => {
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 py-8">
      {/* Promo Triple Banners (Photo 1 exact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#18181B] text-white p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">MEGA SALE</span>
            <h4 className="text-2xl font-black text-amber-400 mt-1">UP TO 50% OFF</h4>
            <p className="text-xs text-gray-400 mt-0.5">On Bestselling Styles</p>
            <button className="mt-4 bg-[#C59B27] hover:bg-amber-600 text-white text-[11px] font-bold px-4 py-2 rounded">
              SHOP NOW
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300" alt="sale" className="w-24 h-24 object-cover rounded-xl" />
        </div>

        <div className="bg-[#D9C4A6] text-gray-900 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-[#785E39] font-extrabold uppercase tracking-widest">NEW COLLECTION</span>
            <h4 className="text-2xl font-black mt-1">JUST LANDED</h4>
            <p className="text-xs text-[#785E39] mt-0.5">Upgrade Your Style</p>
            <button className="mt-4 bg-gray-950 text-white hover:bg-black text-[11px] font-bold px-4 py-2 rounded">
              SHOP NOW
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300" alt="new" className="w-24 h-24 object-cover rounded-xl" />
        </div>

        <div className="bg-[#EDE9E3] text-gray-900 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">LIMITED STOCK</span>
            <h4 className="text-2xl font-black mt-1">HURRY UP!</h4>
            <p className="text-xs text-gray-500 mt-0.5">Grab Before It's Gone</p>
            <button className="mt-4 bg-[#C59B27] hover:bg-amber-600 text-white text-[11px] font-bold px-4 py-2 rounded">
              SHOP NOW
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" alt="hoodie" className="w-24 h-24 object-cover rounded-xl" />
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs text-[#C59B27] uppercase tracking-[0.2em] font-extrabold flex items-center gap-2">
            <span>——</span> TRENDING NOW <span>——</span>
          </span>
        </div>
        <a href="#products" className="text-xs font-bold text-gray-500 hover:text-[#C59B27] transition">
          VIEW ALL →
        </a>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredProducts.map((prod: any) => {
          const discount = prod.original_price
            ? Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)
            : null;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition duration-200 group"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                {discount && (
                  <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    {discount}% OFF
                  </span>
                )}
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#C59B27] transition">
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 text-[11px] mt-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-gray-700">{prod.rating || 4.8}</span>
                    <span className="text-gray-400 text-[10px]">({prod.reviews_count || 50})</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm font-extrabold text-gray-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    {prod.original_price && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{prod.original_price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(prod)}
                    className="w-full bg-[#C59B27] hover:bg-[#B0881E] text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};