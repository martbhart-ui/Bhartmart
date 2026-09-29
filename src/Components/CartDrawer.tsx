import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Copy,
  Check,
  Truck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from './ThemeContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  onCheckoutSuccess?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  setCart,
  onCheckoutSuccess,
}) => {
  const { theme } = useTheme();

  // Admin Security Settings for Payment
  const codEnabled = theme.securitySettings?.codEnabled ?? true;
  const upiId = theme.securitySettings?.upiId || 'vedantgadewar291-1@okicici';
  const customQrUrl = theme.securitySettings?.qrCodeUrl || '';

  // Checkout Steps: 'cart' | 'shipping' | 'success'
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>(codEnabled ? 'cod' : 'online');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Customer Shipping Details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  const removeItem = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill all delivery details!');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        total_amount: totalAmount,
        status: 'Pending',
        payment_method: paymentMethod === 'online' ? 'Online UPI / QR Code' : 'Cash on Delivery (COD)',
        transaction_id: paymentMethod === 'online' ? utrNumber.trim() || 'Paid via UPI QR' : null,
        items: cart.map((c) => ({
          id: c.id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          selectedSize: c.selectedSize || 'M',
        })),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
      if (error) throw error;

      const generatedId = data && data[0] ? data[0].id : String(Date.now());
      setPlacedOrderId(generatedId);
      setCart([]);
      setStep('success');
      if (onCheckoutSuccess) onCheckoutSuccess();
    } catch (err: any) {
      alert('Order failed: ' + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Dynamic UPI payment link for QR Code
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=BHART%20MART&am=${totalAmount}&cu=INR`;
  const dynamicQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <div className="fixed inset-0 z-[10000] flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0B0F17] text-gray-100 h-full flex flex-col border-l border-gray-800 shadow-2xl">
        
        {/* HEADER */}
        <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between bg-[#141A28]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              {step === 'cart' ? `Your Shopping Cart (${cart.length})` : step === 'shipping' ? 'Secure Checkout' : 'Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xs">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  Your cart is empty. Add products from the catalog!
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="p-4 bg-[#141A28] border border-gray-800 rounded-2xl flex items-center justify-between gap-3 shadow-md"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-gray-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <span className="text-[10px] text-gray-400">Size: {item.selectedSize || 'M'}</span>
                      <span className="text-xs font-black text-[#C59B27] block mt-0.5">₹{item.price}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-[#0B0F17] rounded-lg border border-gray-700">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#C59B27]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-[#141A28] border-t border-gray-800 space-y-4">
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-gray-400">Total Order Amount:</span>
                  <span className="text-xl text-[#C59B27]">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-[#C59B27] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#C59B27]/20 cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SHIPPING DETAILS & PAYMENT SELECTION */}
        {step === 'shipping' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-3">
                  1. Delivery Address
                </span>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#141A28] border border-gray-700 text-white outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp Number (+91)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#141A28] border border-gray-700 text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="Flat / House No, Street, Landmark, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#141A28] border border-gray-700 text-white outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="6-Digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#141A28] border border-gray-700 text-white outline-none"
                  />
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION (MEESHO / AMAZON STYLE) */}
              <div>
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-3">
                  2. Select Payment Method
                </span>

                <div className="space-y-3">
                  {/* OPTION A: CASH ON DELIVERY */}
                  {codEnabled && (
                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        paymentMethod === 'cod'
                          ? 'bg-[#C59B27]/10 border-[#C59B27] text-white shadow-md'
                          : 'bg-[#141A28] border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="text-xs font-bold text-white">Cash on Delivery (COD)</h4>
                          <span className="text-[10px] text-gray-400">Pay cash upon parcel delivery at your doorstep</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#C59B27] w-4 h-4 cursor-pointer"
                      />
                    </label>
                  )}

                  {/* OPTION B: PAY ONLINE (UPI & QR SCANNER) */}
                  <label
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'online'
                        ? 'bg-[#C59B27]/10 border-[#C59B27] text-white shadow-md'
                        : 'bg-[#141A28] border-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">Pay Online (UPI / QR Code)</h4>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded uppercase">
                            Instant Verification
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">Scan QR code using GPay, PhonePe, Paytm, or BHIM</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="accent-[#C59B27] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {/* ONLINE QR CODE VIEWER BOX */}
                {paymentMethod === 'online' && (
                  <div className="mt-4 p-5 bg-[#141A28] border border-amber-500/30 rounded-3xl space-y-4 animate-fadeIn">
                    <div className="text-center">
                      <span className="text-[11px] font-black uppercase text-amber-400">
                        Scan & Pay ₹{totalAmount}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Use any UPI app to scan and complete payment</p>
                    </div>

                    <div className="flex justify-center">
                      <div className="p-3 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <img
                          src={customQrUrl || dynamicQrCode}
                          alt="Payment QR"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#0B0F17] rounded-xl border border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">Store UPI VPA:</span>
                        <span className="text-xs font-mono font-bold text-white">{upiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer border border-gray-700"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedUpi ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-400 block mb-1">
                        Transaction Ref / UTR No. (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 32849204928"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-[#141A28] border-t border-gray-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-gray-400">Payable Total:</span>
                <span className="text-lg text-[#C59B27]">₹{totalAmount}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 bg-white/5 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-[#C59B27] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#C59B27]/20 cursor-pointer"
                >
                  {submittingOrder
                    ? 'Confirming Order...'
                    : paymentMethod === 'online'
                    ? 'Confirm Online Payment & Place Order'
                    : 'Confirm Order (Cash on Delivery)'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Order Confirmed Successfully!</h3>
              <p className="text-xs text-gray-400 mt-1">Thank you for shopping with BHART MART.</p>
              <span className="inline-block mt-2 font-mono text-xs bg-white/5 border border-gray-700 px-3 py-1 rounded-lg text-[#C59B27]">
                Order ID: #{placedOrderId.slice(0, 10)}
              </span>
            </div>
            <button
              onClick={() => {
                setStep('cart');
                onClose();
              }}
              className="w-full py-3.5 bg-[#C59B27] text-black font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg mt-4"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};