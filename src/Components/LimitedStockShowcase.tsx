import React, { useEffect, useState, useCallback } from 'react';
import { Flame, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LimitedStockProps {
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

export const LimitedStockShowcase: React.FC<LimitedStockProps> = ({
  onProductClick,
  onAddToCart,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShowcaseData = useCallback(async () => {
    try {
      const { data: settings } = await supabase
        .from('showcase_settings')
        .select('*')
        .eq('id', 'limited_stock')
        .maybeSingle();

      if (!settings || !settings.is_active) {
        setIsActive(false);
        setProducts([]);
        setLoading(false);
        return;
      }

      setIsActive(true);
      const productIds: string[] = settings.product_ids || [];

      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      setProducts(prods || []);
    } catch (err) {
      console.error('Showcase realtime load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShowcaseData();

    // Instant Realtime Channel Listener
    const channel = supabase
      .channel('live-limited-stock-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'showcase_settings' },
        () => {
          fetchShowcaseData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchShowcaseData]);

  if (!isActive || loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-black tracking-wider uppercase mb-2 animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          LIMITED STOCK ALERT
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
          Grab Before They're Gone!
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Only few pieces left. High demand items sell out fast.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => onProductClick && onProductClick(item)}
            className="group relative bg-white rounded-2xl border border-rose-100 hover:border-rose-400 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-white" />
                {item.stock && item.stock <= 10
                  ? `Only ${item.stock} left!`
                  : 'Limited Stock'}
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-rose-600 transition">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-black text-gray-900">
                  ₹{item.price}
                </span>
                {onAddToCart && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-600 hover:text-white text-gray-700 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};