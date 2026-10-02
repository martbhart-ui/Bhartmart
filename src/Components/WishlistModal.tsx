import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: any[];
  onRemoveFromWishlist: (id: string) => void;
  onMoveToCart: (product: any) => void;
  onMoveAllToCart?: (items: any[]) => void;
  isDarkMode?: boolean;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  const handleMoveAll = () => {
    if (wishlist.length === 0) return;

    if (onMoveAllToCart) {
      onMoveAllToCart(wishlist);
    } else {
      // Fallback: Sequentially move each item
      wishlist.forEach((item) => onMoveToCart(item));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl transition-colors duration-300 ${
          isDarkMode ? 'bg-[#111622] text-white border-l border-gray-800' : 'bg-white text-gray-900'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">My Wishlist</h3>
                <span className="text-[11px] text-gray-400 font-bold">
                  {wishlist.length} {wishlist.length === 1 ? 'item saved' : 'items saved'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Wishlist Products */}
          <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold">Your wishlist is empty!</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Save your favorite items here by clicking the heart icon on any product.
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                    isDarkMode
                      ? 'bg-[#141A28] border-gray-800 hover:border-gray-700'
                      : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold truncate">{item.name}</h4>
                    <span className="text-xs font-black text-[#C59B27] mt-0.5 block">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onMoveToCart(item)}
                      className="p-2 rounded-xl bg-black hover:bg-[#C59B27] text-white hover:text-black transition cursor-pointer text-xs font-bold flex items-center gap-1 shadow-sm"
                      title="Move to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {wishlist.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleMoveAll}
              className="w-full py-3 bg-[#C59B27] hover:bg-[#b0881e] text-black font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-[#C59B27]/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};