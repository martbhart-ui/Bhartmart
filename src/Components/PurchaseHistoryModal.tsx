import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, X, CheckCircle2, Clock, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone: string;
}

export const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
  isOpen,
  onClose,
  userPhone,
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userPhone) {
      fetchOrders();
    }
  }, [isOpen, userPhone]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const cleanPhone = userPhone.replace(/\D/g, '').slice(-10);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', cleanPhone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-blue-200">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-[#C59B27] text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C59B27] flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">Purchase History</h3>
            <p className="text-xs text-gray-400">Past orders for +91 {userPhone}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-xs">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-16 h-16 bg-amber-50 text-[#C59B27] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-gray-900">
                Your shopping journey begins here!✨
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                You haven't placed any orders yet. Discover our latest collections!
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-800 transition"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                let items: any[] = [];
                try {
                  items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                } catch {
                  items = [];
                }

                return (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-gray-200/60 pb-2">
                      <span className="font-bold text-gray-600">
                        Order ID: #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {getStatusBadge(order.status || 'Pending')}
                    </div>

                    <div className="space-y-1.5">
                      {Array.isArray(items) &&
                        items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-gray-800 truncate max-w-[220px]">
                              {item.name}
                            </span>
                            <span className="text-gray-500">
                              Qty: {item.quantity || 1} • ₹{item.price}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-xs">
                      <span className="text-gray-500">Payment: COD</span>
                      <span className="font-black text-[#C59B27] text-sm">₹{order.total_amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};