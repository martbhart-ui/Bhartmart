import React from 'react';
import { Phone, Mail, MapPin, Truck, RotateCcw, ShieldCheck, Lock, Award } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-[#0A0E17] text-white border-t border-gray-800/80 mt-16">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800/60 py-8 px-4 bg-[#0D121F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C59B27]" /> JOIN OUR NEWSLETTER
            </h4>
            <p className="text-xs text-gray-400 mt-1">Get exclusive offers, new arrivals & more updates.</p>
          </div>
          <div className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email..."
              className="bg-black/60 border border-gray-700 text-xs px-4 py-2.5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C59B27] flex-1"
            />
            <button className="bg-[#C59B27] hover:bg-[#B0881E] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer (Photo 2 exact layout) */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#C59B27] flex items-center justify-center font-black text-black text-lg shadow">
              🏪
            </div>
            <span className="text-lg font-black tracking-wider text-white uppercase">
              BHART MART
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            India's most trusted online destination for premium lifestyle, fashion, electronics, and daily essentials at unbeatable prices.
          </p>
        </div>

        {/* Quick Links (Photo 2) */}
        <div>
          <h4 className="text-xs font-black tracking-wider text-[#C59B27] uppercase mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
            <li><a href="#" className="hover:text-[#C59B27] transition">Home</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">All Products</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">Cart</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">My Orders</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">Liked Products</a></li>
            <li><a href="#" className="flex items-center gap-1.5 hover:text-[#C59B27] transition">🚚 Track Order</a></li>
            <li>
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 text-[#C59B27] hover:underline font-bold"
              >
                🛡️ Owner Admin Panel
              </button>
            </li>
          </ul>
        </div>

        {/* Categories (Photo 2) */}
        <div>
          <h4 className="text-xs font-black tracking-wider text-[#C59B27] uppercase mb-4">
            CATEGORIES
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
            <li><a href="#products" className="hover:text-[#C59B27] transition">Electronics</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">Fashion</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">Home & Kitchen</a></li>
            <li><a href="#products" className="hover:text-[#C59B27] transition">Grocery</a></li>
          </ul>
        </div>

        {/* Contact Us (Photo 2 exact details) */}
        <div>
          <h4 className="text-xs font-black tracking-wider text-[#C59B27] uppercase mb-4">
            CONTACT US
          </h4>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>+91 9022482630 / +91 9310850160</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>martbharat5@gmail.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
              <span>Nagpur - 440024 | Delhi - 440024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (Photo 2 exact) */}
      <div className="border-t border-gray-800/80 py-4 px-4 bg-[#080B12]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
          <span className="flex items-center gap-1.5 text-amber-200/90 font-semibold">
            <Award className="w-3.5 h-3.5 text-[#C59B27]" /> 100% Original
          </span>
          <span className="flex items-center gap-1.5 text-amber-200/90 font-semibold">
            <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" /> Easy Returns
          </span>
          <span className="flex items-center gap-1.5 text-amber-200/90 font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#C59B27]" /> Secure Payment
          </span>
          <span className="flex items-center gap-1.5 text-amber-200/90 font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#C59B27]" /> Fast Delivery
          </span>
          <span className="flex items-center gap-1.5 text-amber-200/90 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" /> Made in India
          </span>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t border-gray-900 py-3 text-center text-[11px] text-gray-500">
        © 2026 BHART MART. All rights reserved. Built for speed and reliability.
      </div>
    </footer>
  );
};