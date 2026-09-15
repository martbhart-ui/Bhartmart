import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, setCart } = useStore() as any;
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', fullAddress: '', pincode: '' });

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.fullAddress) {
      alert('Kripya apna poora delivery address aur mobile number bharein.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item: any) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url
      }));

      // Supabase me entry insert karo
      const { data, error } = await supabase.from('orders').insert([
        {
          customer_name: address.name.trim(),
          phone: address.phone.trim(),
          address: address.fullAddress.trim(),
          pincode: address.pincode.trim() || '440024',
          items: orderItems,
          total_amount: Number(cartTotal),
          payment_method: 'COD',
          status: 'Pending'
        }
      ]).select();

      if (error) {
        console.error('Supabase Error:', error);
        alert('Supabase Order Error: ' + error.message);
        setIsSubmitting(false);
        return;
      }

      console.log('Order successfully inserted:', data);
      setOrderPlaced(true);
      if (setCart) setCart([]);
      setAddress({ name: '', phone: '', fullAddress: '', pincode: '' });
    } catch (err: any) {
      console.error('Catch error:', err);
      alert('Order Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-gray-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
              <h2 className="text-base font-bold">Shopping Cart ({cart.length})</h2>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderPlaced ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">Order Placed Successfully!</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Aapka COD order save ho gaya hai aur Admin Panel me sync ho chuka hai.
                </p>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    onClose();
                  }}
                  className="mt-4 bg-[#C59B27] text-white text-xs font-bold px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#B0881E] transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-500">Cart is empty</p>
                <p className="text-xs text-gray-400">Storefront se product add karein.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item: any) => (
                    <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                        <p className="text-xs font-bold text-[#C59B27] mt-0.5">₹{item.product.price}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 text-gray-500 hover:text-black cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 text-gray-500 hover:text-black cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Form */}
                <form onSubmit={handleCheckout} className="pt-4 border-t border-gray-100 space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Cash On Delivery Details
                  </h4>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C59B27]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C59B27]"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Complete Delivery Address, House/Flat No, Landmark"
                    value={address.fullAddress}
                    onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C59B27]"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C59B27]"
                  />

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 mb-2 font-medium">
                      <span>Delivery</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total (COD)</span>
                      <span className="text-[#C59B27]">₹{cartTotal}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-3 bg-[#C59B27] hover:bg-[#B0881E] text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider transition shadow cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Cash On Delivery Order'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};