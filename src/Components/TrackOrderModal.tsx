import React, { useState } from 'react';
import { Search, Package, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OrderTimeline } from './OrderTimeline';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Kripya valid 10-digit mobile number enter karein.');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', cleanPhone)
        .order('created_at', { ascending: false });

      if (err) throw err;

      setOrders(data || []);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Orders load nahi ho paaye.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 my-auto max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-2 border border-amber-200">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-gray-900">Live Order Tracking</h3>
          <p className="text-xs text-gray-500">
            Check real-time delivery status & milestone timeline
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-5">
          <input
            type="tel"
            required
            maxLength={10}
            placeholder="Enter 10-digit Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C59B27] font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C59B27] hover:bg-[#B0881E] disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#C59B27]/20"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Results */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {searched && orders.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              Is mobile number par koi active order nahi mila.
            </div>
          )}

          {orders.map((order) => {
            let items: any[] = [];
            try {
              items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            } catch {
              items = [];
            }

            return (
              <div
                key={order.id}
                className="p-5 bg-gray-50/70 rounded-3xl border border-gray-200/80 space-y-4 shadow-xs"
              >
                {/* Header summary */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Order ID: #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <h4 className="text-xs font-black text-gray-900">{order.customer_name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#C59B27]">₹{order.total_amount}</span>
                    <span className="text-[10px] text-gray-400 block font-medium">Payment: COD</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1">
                  {Array.isArray(items) &&
                    items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-700">
                        <span className="font-semibold truncate max-w-[240px]">{item.name}</span>
                        <span className="text-gray-500 font-medium">
                          Qty: {item.quantity || 1} • ₹{item.price}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Exact Vertical Milestone Timeline */}
                <OrderTimeline status={order.status || 'Pending'} createdAt={order.created_at} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};