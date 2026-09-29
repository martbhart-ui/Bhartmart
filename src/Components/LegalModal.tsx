import React from 'react';
import { X, ShieldCheck, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'returns' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'returns' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center border border-amber-200">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">7-Day Luxury Guarantee & Returns</h3>
            <div className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Har order ke sath 7 din ki straightforward replacement/return facility available hai.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Doorstep pickup ke waqt bina kisi sawaal ke exchange process execute hota hai.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Product tags aur original premium box packaging intact honi chahiye.</span>
              </p>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">Privacy & Data Protection Promise</h3>
            <div className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <p>BhartMart par aapka phone number aur address strictly encrypted rehte hain.</p>
              <p>Hum kisi bhi 3rd-party advertisers ya telecallers ko customer data sell nahi karte.</p>
              <p>SMS notifications sirf order delivery status aur verification OTP ke liye use hote hain.</p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center border border-amber-200">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">Terms of Luxury Service</h3>
            <div className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <p>Tamper-evident packaging deliver hone par hi Cash on Delivery amount courier partner ko hand over karein.</p>
              <p>Orders typically 3-5 business days ke andar all-India express hubs se deliver ho jaate hain.</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition cursor-pointer"
        >
          Understood & Accept
        </button>
      </div>
    </div>
  );
};