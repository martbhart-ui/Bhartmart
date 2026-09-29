import React, { useState } from 'react';
import { X, Headphones, Send, CheckCircle2 } from 'lucide-react';

export interface SupportTicket {
  id: string;
  name: string;
  mobile: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !message) return;

    const newTicket: SupportTicket = {
      id: 'TKT-' + Date.now().toString().slice(-6),
      name,
      mobile,
      subject: subject || 'General Inquiry',
      message,
      status: 'Open',
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    // Save to localStorage so admin can see it live
    const existingTickets: SupportTicket[] = JSON.parse(
      localStorage.getItem('bharatmart_support_tickets') || '[]'
    );
    existingTickets.unshift(newTicket);
    localStorage.setItem('bharatmart_support_tickets', JSON.stringify(existingTickets));

    // Broadcast event for live update in Admin panel if opened
    window.dispatchEvent(new Event('bharatmart_new_ticket'));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setMobile('');
      setSubject('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C59B27] flex items-center justify-center border border-amber-200">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">24/7 Customer Support</h3>
            <p className="text-xs text-gray-500">We are here to help you anytime. Send us your inquiry!</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center flex flex-col items-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-base font-bold text-gray-900">Ticket Submitted Successfully!</h4>
            <p className="text-xs text-gray-500 mt-1">Our support team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C59B27] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit mobile number"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C59B27] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Order Tracking, Delivery Issue, Product Inquiry"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C59B27] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C59B27] bg-gray-50 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C59B27] hover:bg-[#b0881e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C59B27]/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};