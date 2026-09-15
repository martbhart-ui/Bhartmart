import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  return (
    <div>
      {/* Main Fashion Hero Banner (Photo 1) */}
      <div className="relative bg-[#ECE5DD] overflow-hidden border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <span className="inline-block bg-[#E3D8C8] text-[#8B6E30] text-[11px] font-extrabold uppercase px-3 py-1 rounded tracking-wider">
              NEW ARRIVALS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight uppercase leading-none">
              FASHION THAT <br />
              <span className="text-[#C59B27]">DEFINES YOU</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Trendy Styles. Premium Quality. Best Prices.
            </p>
            <div className="pt-2">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B0881E] text-white font-bold text-xs uppercase px-8 py-3.5 rounded shadow-lg transition transform hover:-translate-y-0.5"
              >
                SHOP NOW →
              </a>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format&fit=crop&q=80"
              alt="Fashion that defines you"
              className="rounded-2xl shadow-xl max-h-[380px] w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Value Proposition Bar (Photo 1: Cash on delivery, free shipping, etc.) */}
      <div className="bg-white border-b border-gray-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-gray-700">
          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">CASH ON DELIVERY</p>
              <p className="text-[10px] text-gray-400">Pay when you receive</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">FREE SHIPPING</p>
              <p className="text-[10px] text-gray-400">On all orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">EASY RETURNS</p>
              <p className="text-[10px] text-gray-400">Hassle-free 7 days</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">SECURE PAYMENTS</p>
              <p className="text-[10px] text-gray-400">100% Secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">FAST DISPATCH</p>
              <p className="text-[10px] text-gray-400">Shipped in 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">TRUSTED STORE</p>
              <p className="text-[10px] text-gray-400">Thousands of happy customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};