import React from 'react';
import { ShieldCheck, Sparkles, Award, Lock } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-[#C59B27]/30 py-4 px-4 my-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex items-center gap-1.5 text-[#C59B27] font-black text-xs sm:text-sm tracking-wide">
            <Award className="w-4 h-4" /> 100% PURE LUXURY
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Handpicked premium craft</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-l border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#C59B27] font-black text-xs sm:text-sm tracking-wide">
            <Lock className="w-4 h-4" /> 256-BIT ENCRYPTION
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Ultra-secure checkout flow</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#C59B27] font-black text-xs sm:text-sm tracking-wide">
            <Sparkles className="w-4 h-4" /> TAMPER-PROOF PACK
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Discreet luxury unboxing</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-neutral-800">
          <div className="flex items-center gap-1.5 text-[#C59B27] font-black text-xs sm:text-sm tracking-wide">
            <ShieldCheck className="w-4 h-4" /> ZERO-RISK COD
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Pay only upon doorstep inspection</p>
        </div>
      </div>
    </section>
  );
};