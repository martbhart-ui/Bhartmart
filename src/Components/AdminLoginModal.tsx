import React, { useState } from 'react';
import { Lock, Mail, KeyRound, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.trim() === 'martbharat5@gmail.com' && password === 'mayved@2026') {
      localStorage.setItem('bharatmart_admin_auth', 'true');
      onSuccess();
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid Admin Credentials. Access Denied!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-center text-gray-900">Admin Portal Access</h3>
        <p className="text-xs text-center text-gray-500 mb-5">Enter authorized credentials to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="martbharat5@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C59B27] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C59B27] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#C59B27] hover:bg-[#B0881E] text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md shadow-[#C59B27]/25"
          >
            Authenticate & Open Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};