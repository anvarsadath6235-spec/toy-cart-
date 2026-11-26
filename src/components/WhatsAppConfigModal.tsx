'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, MessageCircle, Check, Smartphone, Store } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function WhatsAppConfigModal({ onClose }: Props) {
  const { whatsappNumber, setWhatsappNumber, showToast } = useCart();
  const [inputVal, setInputVal] = useState(whatsappNumber);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.replace(/\D/g, '');
    if (clean.length < 8) {
      showToast('Please enter a valid phone number with country code', 'info');
      return;
    }
    setWhatsappNumber(clean);
    showToast('WhatsApp store number updated! Orders will be sent here 📲');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 fill-green-600 text-green-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-on-surface">
              WhatsApp Store Settings
            </h3>
            <p className="text-xs text-on-surface-variant">
              Customer orders will open in WhatsApp directed to this number.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Store WhatsApp Number (with Country Code)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-outline">
                +
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. 919876543210 (Country code + number)"
                className="w-full h-11 pl-7 pr-3 rounded-xl bg-surface-container-low text-on-surface font-semibold text-sm outline-none border border-transparent focus:border-secondary transition-colors"
              />
            </div>
            <p className="text-[11px] text-outline mt-1.5">
              Include country code without '+' or spaces (e.g., <code>919876543210</code> for India, <code>14155552671</code> for US).
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex flex-col gap-1">
            <span className="font-bold text-on-surface flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-secondary" />
              How WhatsApp Production Ordering Works:
            </span>
            <span>1. Customer fills delivery address (no account needed).</span>
            <span>2. Taps &quot;Send Order to WhatsApp&quot;.</span>
            <span>3. WhatsApp opens with an itemized, priced order message.</span>
            <span>4. Store confirms the order directly with the customer.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full font-bold text-xs text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Number</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
