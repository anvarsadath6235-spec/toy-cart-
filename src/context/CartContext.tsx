'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, AgeGroup, Category } from '@/types';
import { STORE_SETTINGS } from '@/data/products';

interface ToastState {
  message: string;
  show: boolean;
  type?: 'success' | 'info';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  activeAgeFilter: AgeGroup;
  setActiveAgeFilter: (age: AgeGroup) => void;

  activeCategoryFilter: Category;
  setActiveCategoryFilter: (cat: Category) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info') => void;

  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeAgeFilter, setActiveAgeFilter] = useState<AgeGroup>('All Ages');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<Category>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(
    STORE_SETTINGS.whatsappNumber
  );
  const [toast, setToast] = useState<ToastState>({
    message: '',
    show: false,
    type: 'success',
  });

  // Load from localStorage on initial client render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('wt_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        // Pre-populate with 2 default playful items as shown in Stitch design mock
        // (so cart opens with realistic items just like Stitch screens!)
        import('@/data/products').then(({ PRODUCTS }) => {
          const defaultItems: CartItem[] = [
            { product: PRODUCTS[0], quantity: 1 },
            { product: PRODUCTS[2], quantity: 1 },
          ];
          setItems(defaultItems);
          localStorage.setItem('wt_cart', JSON.stringify(defaultItems));
        });
      }

      const savedWishlist = localStorage.getItem('wt_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedPhone = localStorage.getItem('wt_whatsapp_number');
      if (savedPhone) {
        setWhatsappNumber(savedPhone);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wt_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wt_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Save custom WhatsApp number
  useEffect(() => {
    try {
      localStorage.setItem('wt_whatsapp_number', whatsappNumber);
    } catch {
      // ignore
    }
  }, [whatsappNumber]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, show: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart! 🏰`);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your family wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= STORE_SETTINGS.freeShippingThreshold
      ? 0
      : STORE_SETTINGS.flatShippingRate;

  const total = subtotal + shipping;

  const freeShippingRemaining = Math.max(
    0,
    STORE_SETTINGS.freeShippingThreshold - subtotal
  );

  const freeShippingProgress = Math.min(
    100,
    (subtotal / STORE_SETTINGS.freeShippingThreshold) * 100
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
        freeShippingProgress,
        freeShippingRemaining,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        activeAgeFilter,
        setActiveAgeFilter,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        whatsappNumber,
        setWhatsappNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
