import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import { LegalModal } from './LegalModal';

interface FooterProps {
  onSecretAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSecretAdminClick }) => {
  const [legalType, setLegalType] = useState<'returns' | 'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-neutral-950 text-white border-t border-[#C59B27]/20 pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 border border-[#C59B27]/40 text-[#C59B27] rounded-2xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-neutral-200 uppercase">Express Dispatch</h4>
                <p className="text-[11px] text-neutral-400">All India 3-5 Day Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 border border-[#C59B27]/40 text-[#C59B27] rounded-2xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-neutral-200 uppercase">Doorstep COD</h4>
                <p className="text-[11px] text-neutral-400">Inspect & Pay on Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 border border-[#C59B27]/40 text-[#C59B27] rounded-2xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-neutral-200 uppercase">7-Day Returns</h4>
                <p className="text-[11px] text-neutral-400">Zero-Hassle Exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 border border-[#C59B27]/40 text-[#C59B27] rounded-2xl">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-neutral-200 uppercase">Concierge Support</h4>
                <p className="text-[11px] text-neutral-400">Instant VIP Resolution</p>
              </div>
            </div>
          </div>

          {/* Center Brand Identity & Trust Seals */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSecretAdminClick}
                title="BhartMart Admin"
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C59B27] to-[#8F6F16] text-black font-black text-sm flex items-center justify-center cursor-pointer transition hover:scale-105 active:scale-95 shadow-lg shadow-[#C59B27]/20"
              >
                BM
              </button>
              <div>
                <h3 className="text-base font-black tracking-wider text-white">
                  BHART<span className="text-[#C59B27]">MART</span>
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Haute Quality • Certified Indian Dropship
                </p>
              </div>
            </div>

            {/* Clickable Trust Policies */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-neutral-400">
              <button
                onClick={() => setLegalType('returns')}
                className="hover:text-[#C59B27] transition cursor-pointer"
              >
                Return Guarantee
              </button>
              <span>•</span>
              <button
                onClick={() => setLegalType('privacy')}
                className="hover:text-[#C59B27] transition cursor-pointer"
              >
                Privacy Promise
              </button>
              <span>•</span>
              <button
                onClick={() => setLegalType('terms')}
                className="hover:text-[#C59B27] transition cursor-pointer"
              >
                Terms of Order
              </button>
            </div>
          </div>

          {/* Bottom Security Disclaimer */}
          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>SSL Secured & Verified 256-Bit Encrypted Platform</span>
            </div>
            <p>© 2026 BhartMart. Crafted for Discerning Shoppers.</p>
          </div>
        </div>
      </footer>

      {/* Legal Modal Display */}
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </>
  );
};