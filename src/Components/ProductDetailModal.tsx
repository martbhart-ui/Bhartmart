import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Share2,
} from 'lucide-react';
import { ProductReviews } from './ProductReviews';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  isDarkMode?: boolean;
  wishlist?: any[];
  onToggleWishlist?: (product: any) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  isDarkMode = false,
  wishlist = [],
  onToggleWishlist,
}) => {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [added, setAdded] = useState(false);

  // Gallery Active Media State
  const [activeMedia, setActiveMedia] = useState<string>(product?.image_url || '');

  if (!isOpen || !product) return null;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Combine Primary Cover + Gallery Media into 1 array
  const allMedia: string[] = [
    product.image_url,
    ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
  ].filter(Boolean);

  const currentMediaUrl = activeMedia || product.image_url;

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        ...product,
        selectedSize,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on BHARTMART!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border my-8 max-h-[92vh] flex flex-col transition-colors duration-300 ${
          isDarkMode ? 'bg-[#111622] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT: MAIN IMAGE/VIDEO DISPLAY + THUMBNAILS CAROUSEL */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800">
                {isVideo(currentMediaUrl) ? (
                  <video
                    src={currentMediaUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentMediaUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-md">
                    Only {product.stock} Left in Stock
                  </span>
                )}
              </div>

              {/* 5-7 ADDITIONAL GALLERY THUMBNAILS */}
              {allMedia.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allMedia.map((mediaUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMedia(mediaUrl)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        currentMediaUrl === mediaUrl
                          ? 'border-[#C59B27] scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isVideo(mediaUrl) ? (
                        <video src={mediaUrl} muted className="w-full h-full object-cover pointer-events-none" />
                      ) : (
                        <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: INFO */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#C59B27]">
                    {product.category || 'Curated Collection'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleWishlist && onToggleWishlist(product)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                          : 'border-gray-200 dark:border-gray-700 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-[#C59B27] transition cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    4.8 (Verified Reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#C59B27]">
                    ₹{product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">SELECT SIZE</label>
                <div className="flex items-center gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition cursor-pointer border ${
                        selectedSize === size
                          ? 'bg-black text-[#C59B27] border-[#C59B27] dark:bg-white dark:text-black'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                    : 'bg-[#C59B27] hover:bg-[#b0881e] text-black shadow-[#C59B27]/25'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-[10px] font-bold text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#C59B27]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#C59B27]" />
                  <span>7 Days Return</span>
                </div>
              </div>
            </div>
          </div>

          <ProductReviews
            productId={String(product.id)}
            productName={product.name}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;