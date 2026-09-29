import React, { useState } from 'react';
import { User, Phone, X, AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleDirectAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Kripya 10-digit valid mobile number dalein.');
      return;
    }

    const customerName = name.trim() || `Customer ${cleanPhone.slice(-4)}`;
    const customerObj = {
      id: 'cust_' + cleanPhone,
      phone: cleanPhone,
      name: customerName,
      last_login: new Date().toISOString(),
    };

    setLoading(true);

    try {
      // 1. Database me customer check ya update karein
      try {
        const { data: existingUser } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (existingUser) {
          customerObj.name = existingUser.name || customerName;
          await supabase
            .from('customers')
            .update({ last_login: customerObj.last_login })
            .eq('phone', cleanPhone);
        } else {
          await supabase.from('customers').insert([customerObj]);
        }
      } catch (dbErr) {
        console.warn('Database note:', dbErr);
      }

      // 2. Local Storage me save karein
      localStorage.setItem('bharatmart_customer', JSON.stringify(customerObj));

      setSuccessMsg(`Welcome, ${customerObj.name}!`);

      setTimeout(() => {
        onLoginSuccess(customerObj);
        setSuccessMsg('');
        onClose();
      }, 500);
    } catch {
      setError('Login karne me samasya aayi. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-2 border border-amber-200 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-gray-900">Access Your Account</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter your details for instant access to orders & wishlist
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleDirectAccess} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Your Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Mayank Rawat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C59B27] font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Mobile Number</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
              <span className="absolute left-8 text-xs font-bold text-gray-500">+91</span>
              <input
                type="tel"
                required
                placeholder="10-digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-16 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C59B27] font-medium text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#C59B27] hover:bg-[#B0881E] disabled:opacity-50 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md shadow-[#C59B27]/25 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Accessing Account...' : 'Open Your Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};