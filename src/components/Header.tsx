'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import {
  Search,
  ShoppingBag,
  Heart,
  MessageCircle,
  Sparkles,
  PhoneCall,
  Settings,
} from 'lucide-react';
import WhatsAppConfigModal from './WhatsAppConfigModal';

export default function Header() {
  const { totalItems, setIsCartOpen, setIsSearchOpen, wishlist, whatsappNumber } =
    useCart();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary-container text-on-primary-container text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>
          Summer of Play: FREE Express Delivery on orders over $35 • Instant
          Guest Checkout via WhatsApp
        </span>
        <button
          onClick={() => setShowConfig(true)}
          className="ml-2 underline text-[11px] opacity-80 hover:opacity-100 hidden sm:inline-flex items-center gap-1"
          title="Store WhatsApp Settings"
        >
          <Settings className="w-3 h-3" />
          WhatsApp: +{whatsappNumber}
        </button>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">
                toys
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight group-hover:text-primary transition-colors">
                {STORE_SETTINGS.storeName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline -mt-1 hidden sm:block">
                {STORE_SETTINGS.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-bold text-sm text-on-surface-variant">
            <Link
              href="/"
              className="text-primary hover:text-primary-container transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/#categories"
              className="hover:text-on-surface transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#age-groups"
              className="hover:text-on-surface transition-colors"
            >
              Shop by Age
            </Link>
            <Link
              href="/#bestsellers"
              className="hover:text-on-surface transition-colors"
            >
              Bestsellers
            </Link>
            <Link
              href="/#trust"
              className="hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-brand-mint inline-block"></span>
              Child Safety
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick WhatsApp Support Pill */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hello WonderToys! I have a question about your toys.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-secondary font-bold text-xs hover:bg-surface-container-high transition-colors"
              title="Chat with toy expert"
            >
              <MessageCircle className="w-4 h-4 text-green-600 fill-green-600" />
              <span>WhatsApp Support</span>
            </a>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Search toys"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/#bestsellers"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-tertiary text-on-tertiary font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-sm hover:shadow-md active:scale-95 transition-all"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-on-surface" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-primary-container text-on-primary-container font-extrabold text-[10px] rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">
                Cart
              </span>
            </button>
          </div>
        </div>
      </header>

      {showConfig && (
        <WhatsAppConfigModal onClose={() => setShowConfig(false)} />
      )}
    </>
  );
}
