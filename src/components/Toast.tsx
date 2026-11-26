'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform animate-bounce">
      <div className="bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2.5 border border-white/10 backdrop-blur-md">
        {toast.type === 'info' ? (
          <Info className="w-5 h-5 text-secondary-fixed shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-primary-container shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
