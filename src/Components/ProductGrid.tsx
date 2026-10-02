import React, { useState } from 'react';
import { Heart, Share2, ShoppingBag, Star, Check, } from 'lucide-react';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  onSelectProduct: (product: any) => void;
  onAddToCart: (product: any) => void;
  onToggleWishlist: (product: any) => void;
  wishlist?: any[];
  selectedCategory?: string | null;
  searchTerm?: string;
  onResetFilters?: () => void;
  onOpenCart?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist = [],
  onResetFilters,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isVideo = (url: string) => {
    return url?.match(/\.(mp4|webm|ogg|mov)$/i) || url?.includes('video');
  };

  const handleShare = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); // Card open hone se roke
    const shareUrl = `${window.location.origin}/?product=${product.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on BHART MART!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#141A28] border border-gray-800 rounded-3xl p-4 animate-pulse space-y-3">
            <div className="aspect-square bg-gray-800 rounded-2xl w-full" />
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#141A28] border border-gray-800 rounded-3xl p-8 max-w-lg mx-auto my-8">
        <h3 className="text-base font-black text-white">No Products Found</h3>
        <p className="text-xs text-gray-400 mt-1">Try searching for something else or clear the active filter.</p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-5 py-2 rounded-xl bg-[#C59B27] text-black font-black text-xs cursor-pointer hover:brightness-110 transition"
          >
            Show All Products
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => {
        const isWishlisted = wishlist.some((item) => item.id === product.id);
        const discount = product.original_price
          ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
          : 0;

        return (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group bg-[#141A28] border border-gray-800 hover:border-[#C59B27]/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#C59B27]/10 cursor-pointer relative"
          >
            {/* MEDIA THUMBNAIL */}
            <div className="relative aspect-square overflow-hidden bg-gray-900 animate-pulse">
              {isVideo(product.image_url) ? (
                <video
                  src={product.image_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => (e.currentTarget.parentElement?.classList.remove('animate-pulse'))}
                />
              )}

              {/* TOP-LEFT TAGS */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                {product.is_trending && (
                  <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                    Trending
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* TOP-RIGHT ACTIONS: WISHLIST + SHARE BUTTON */}
              <div className="absolute top-2.5 right-2.5 flex flex-col gap-2">
                {/* 1. WISHLIST HEART */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-600 text-white scale-110'
                      : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/80'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>

                {/* 2. DIRECT SHARE BUTTON (Under Heart) */}
                <button
                  type="button"
                  onClick={(e) => handleShare(e, product)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#C59B27] text-gray-300 hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-md cursor-pointer"
                  title="Share product link"
                >
                  {copiedId === product.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {copiedId === product.id && (
                <div className="absolute inset-x-2 bottom-2 bg-black/90 border border-[#C59B27] py-1 rounded-xl text-center text-[10px] font-bold text-[#C59B27] shadow-lg animate-fadeIn">
                  Link Copied to Clipboard!
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                  {product.category || 'General'}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1 group-hover:text-[#C59B27] transition mt-0.5">
                  {product.name}
                </h3>

                {/* STAR RATING */}
                <div className="flex items-center gap-1 mt-1 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[11px] font-bold text-gray-300">4.8</span>
                  <span className="text-[10px] text-gray-500 ml-1">({product.stock || 20} in stock)</span>
                </div>
              </div>

              {/* PRICE & BUY BUTTON */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/80">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-[#C59B27]">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-[10px] text-gray-500 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#C59B27] text-gray-300 hover:text-black font-black text-xs flex items-center gap-1 transition cursor-pointer border border-gray-700"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Buy
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};