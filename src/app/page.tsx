'use client';

import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import WhatsAppConfigModal from '@/components/WhatsAppConfigModal';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, STORE_SETTINGS } from '@/data/products';
import { AgeGroup, Category, CustomerDetails, Order, Product } from '@/types';
import {
  formatWhatsAppOrderMessage,
  generateOrderId,
  generateWhatsAppLink,
} from '@/utils/whatsapp';

const CATEGORIES: Category[] = [
  'All Categories',
  'Building & Blocks',
  'STEM & Science',
  'Plush Pals',
  'Art & Craft',
  'Puzzles & Games',
];

const AGE_GROUPS: AgeGroup[] = [
  'All Ages',
  '0-2 yrs',
  '3-5 yrs',
  '6-8 yrs',
  '9+ yrs',
];

function getTagClasses(color?: Product['tagColor']): string {
  switch (color) {
    case 'marigold':
      return 'bg-primary-container text-on-primary-container';
    case 'blue':
      return 'bg-secondary-fixed text-on-secondary-fixed';
    case 'coral':
      return 'bg-tertiary-fixed text-on-tertiary-fixed';
    case 'mint':
      return 'bg-brand-mint/20 text-emerald-900';
    default:
      return 'bg-surface-container-high text-on-surface';
  }
}

export default function HomePage() {
  const {
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
    showToast,
    whatsappNumber,
  } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Cart drawer & checkout state
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    isGift: false,
    giftMessage: '',
    paymentPreference: 'whatsapp_cod',
  });

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      if (
        activeCategoryFilter !== 'All Categories' &&
        product.category !== activeCategoryFilter
      ) {
        return false;
      }
      if (activeAgeFilter !== 'All Ages' && product.ageGroup !== activeAgeFilter) {
        return false;
      }
      if (wishlistOnly && !wishlist.includes(product.id)) {
        return false;
      }
      if (query) {
        const haystack =
          `${product.name} ${product.tagline} ${product.category} ${product.ageBadge} ${product.description}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategoryFilter, activeAgeFilter, wishlistOnly, wishlist, searchQuery]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter((p) =>
      `${p.name} ${p.tagline} ${p.category} ${p.ageBadge}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIdx(0);
  };

  const resetFilters = () => {
    setActiveCategoryFilter('All Categories');
    setActiveAgeFilter('All Ages');
    setSearchQuery('');
    setWishlistOnly(false);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty!', 'info');
      return;
    }
    if (
      !customer.fullName.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim() ||
      !customer.city.trim() ||
      !customer.postalCode.trim()
    ) {
      showToast('Please fill in all required delivery fields', 'info');
      return;
    }

    const order: Order = {
      id: generateOrderId(),
      items: [...items],
      customer: { ...customer },
      subtotal,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    };

    const message = formatWhatsAppOrderMessage(order);
    const whatsappUrl = generateWhatsAppLink(whatsappNumber, message);
    order.whatsappUrl = whatsappUrl;

    setLastOrder(order);
    setCheckoutStep('success');
    clearCart();

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore confetti errors in non-visual environments
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showToast('Order prepared! Opening WhatsApp... 🎉');
  };

  const heroFeatured = PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-[#faf7ff] to-[#f5f0ff] text-on-surface pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f8f5ff] to-[#ede9fe] border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-purple-900 font-extrabold text-xs tracking-wide shadow-sm border border-purple-200/60">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>{STORE_SETTINGS.tagline} • Curated for Ages 0–12</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.08]">
                Playful, Screen-Free Toys Built for{' '}
                <span className="text-secondary">Big Imaginations</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Heirloom wooden blocks, solar STEM kits, organic plush pals, and
                non-toxic art sets. Certified child-safe with instant guest
                checkout via WhatsApp.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#bestsellers"
                  className="btn-tactile inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-sm shadow-tactile hover:shadow-tactile-hover"
                >
                  <span>Shop Bestsellers</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#age-groups"
                  className="btn-tactile inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-container-lowest text-on-surface font-bold text-sm border border-outline-variant/40 hover:bg-surface-container transition-colors"
                >
                  <span>Browse by Age</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4">
                <div className="flex items-center gap-2.5 bg-white/90 px-3.5 py-2.5 rounded-2xl border border-purple-100 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-brand-mint shrink-0" />
                  <span className="text-xs font-bold text-on-surface">
                    ASTM &amp; EN71 Safe
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/90 px-3.5 py-2.5 rounded-2xl border border-purple-100 shadow-sm">
                  <Truck className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-xs font-bold text-on-surface">
                    Free Delivery Over ${STORE_SETTINGS.freeShippingThreshold}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/90 px-3.5 py-2.5 rounded-2xl border border-purple-100 shadow-sm">
                  <MessageCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-xs font-bold text-on-surface">
                    1-Tap WhatsApp Order
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Featured Toy Card */}
            <div className="lg:col-span-5">
              <div
                onClick={() => openProductModal(heroFeatured)}
                className="cursor-pointer group bg-white rounded-3xl p-4 sm:p-5 shadow-floating border border-purple-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-low mb-4">
                  <img
                    src={heroFeatured.images[0]}
                    alt={heroFeatured.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-extrabold text-xs shadow-sm">
                    Featured Bestseller
                  </span>
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface font-bold text-xs">
                    {heroFeatured.ageBadge}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-lg text-on-surface group-hover:text-secondary transition-colors">
                      {heroFeatured.name}
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {heroFeatured.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-lg text-on-surface">
                      {STORE_SETTINGS.currency}
                      {heroFeatured.price.toFixed(2)}
                    </div>
                    {heroFeatured.originalPrice && (
                      <div className="text-xs text-outline line-through">
                        {STORE_SETTINGS.currency}
                        {heroFeatured.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category & Age Filters */}
        <section
          id="categories"
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">
                  Explore Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                  Shop by Category
                </h2>
              </div>
              {(activeCategoryFilter !== 'All Categories' ||
                activeAgeFilter !== 'All Ages' ||
                searchQuery ||
                wishlistOnly) && (
                <button
                  onClick={resetFilters}
                  className="self-start sm:self-auto text-xs font-bold text-secondary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((category) => {
                const active = activeCategoryFilter === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategoryFilter(category)}
                    className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      active
                        ? 'bg-primary-container text-on-primary-container shadow-tactile'
                        : 'bg-white text-on-surface-variant border border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div
              id="age-groups"
              className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-100"
            >
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-outline uppercase tracking-wider shrink-0 mr-1">
                  Age:
                </span>
                {AGE_GROUPS.map((age) => {
                  const active = activeAgeFilter === age;
                  return (
                    <button
                      key={age}
                      onClick={() => setActiveAgeFilter(age)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        active
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-purple-50/80 text-on-surface-variant hover:bg-purple-100/80'
                      }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setWishlistOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  wishlistOnly
                    ? 'bg-tertiary text-on-tertiary shadow-sm'
                    : 'bg-white text-on-surface-variant border border-purple-100 hover:bg-purple-50'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${wishlistOnly ? 'fill-current' : ''}`}
                />
                <span>Saved ({wishlist.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section
          id="bestsellers"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-on-surface-variant">
              Showing{' '}
              <span className="font-extrabold text-on-surface">
                {filteredProducts.length}
              </span>{' '}
              {filteredProducts.length === 1 ? 'toy' : 'toys'}
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-10 text-center border border-surface-container-high shadow-card">
              <Package className="w-12 h-12 text-outline mx-auto mb-3" />
              <h3 className="font-extrabold text-lg text-on-surface">
                No toys match those filters
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-5">
                Try clearing your search or selecting a different age group.
              </p>
              <button
                onClick={resetFilters}
                className="btn-tactile px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-sm shadow-tactile"
              >
                Show All Toys
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((product) => {
                const wishlisted = isWishlisted(product.id);
                return (
                  <article
                    key={product.id}
                    className="group bg-white rounded-3xl p-3.5 border border-purple-100 hover:border-purple-300 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col"
                  >
                    <div
                      onClick={() => openProductModal(product)}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low cursor-pointer mb-3.5"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.tag && (
                        <span
                          className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full font-extrabold text-[11px] shadow-sm ${getTagClasses(
                            product.tagColor
                          )}`}
                        >
                          {product.tag}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label={
                          wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                        }
                        className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlisted
                              ? 'text-tertiary fill-tertiary'
                              : 'text-on-surface-variant'
                          }`}
                        />
                      </button>
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-[11px] font-bold text-on-surface">
                        {product.ageBadge}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col px-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-on-surface-variant mb-1">
                        <span className="font-bold text-secondary truncate">
                          {product.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-on-surface shrink-0">
                          <Star className="w-3.5 h-3.5 fill-primary-container text-primary-container" />
                          {product.rating.toFixed(1)}
                          <span className="text-outline font-medium">
                            ({product.reviewCount})
                          </span>
                        </span>
                      </div>

                      <h3
                        onClick={() => openProductModal(product)}
                        className="font-extrabold text-base text-on-surface leading-snug cursor-pointer group-hover:text-secondary transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 flex-1">
                        {product.tagline}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-surface-container">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-lg text-on-surface">
                            {STORE_SETTINGS.currency}
                            {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-outline line-through">
                              {STORE_SETTINGS.currency}
                              {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary-container text-on-primary-container font-extrabold text-xs shadow-tactile hover:brightness-105"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Child Safety & Trust Section */}
        <section
          id="trust"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
        >
          <div className="bg-gradient-to-br from-white via-[#faf7ff] to-[#f3e8ff]/70 rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-card">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                Parent Promise
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                Safe Materials, Thoughtful Design
              </h2>
              <p className="text-sm text-on-surface-variant mt-2">
                Every toy in {STORE_SETTINGS.storeName} is independently tested
                for little hands—free from harsh chemicals, sharp edges, and
                noisy distractions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-brand-mint mb-3" />
                <h3 className="font-extrabold text-base text-on-surface">
                  Certified Non-Toxic
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  ASTM F963 &amp; EN71 compliant finishes using water-based
                  stains, organic cotton, and BPA-free polymers.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
                <Gift className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-extrabold text-base text-on-surface">
                  Free Gift Wrapping
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Add a personal birthday or holiday note right in your guest
                  WhatsApp checkout—complete with ribbon &amp; card.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
                <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-extrabold text-base text-on-surface">
                  Direct WhatsApp Support
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  No account sign-ups or passwords. Send your cart directly to
                  our toy specialists for instant order confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-10 px-4 sm:px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-extrabold text-xl tracking-tight">
              {STORE_SETTINGS.storeName}
            </div>
            <p className="text-xs text-inverse-on-surface/75 mt-1">
              {STORE_SETTINGS.tagline} • Support: {STORE_SETTINGS.supportEmail}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <a href="#categories" className="hover:underline">
              Categories
            </a>
            <a href="#age-groups" className="hover:underline">
              Shop by Age
            </a>
            <a href="#bestsellers" className="hover:underline">
              Bestsellers
            </a>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>WhatsApp Settings (+{whatsappNumber})</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-surface-container-high px-4 py-2 pb-safe flex items-center justify-around">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-on-surface"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">Search</span>
        </button>
        <a
          href="#bestsellers"
          className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-on-surface"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">Toys</span>
        </a>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-primary font-extrabold"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary-container text-on-primary-container text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-surface-container-high"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-surface-container pb-3">
              <Search className="w-5 h-5 text-outline shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wooden blocks, STEM kits, plush..."
                className="flex-1 bg-transparent text-sm font-semibold text-on-surface outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-outline hover:text-on-surface"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto flex flex-col gap-2">
              {searchResults.length === 0 ? (
                <p className="text-sm text-on-surface-variant py-6 text-center">
                  No toys found for &quot;{searchQuery}&quot;.
                </p>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      openProductModal(product);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-surface-container-low text-left transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-surface-container"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-on-surface truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate">
                        {product.category} • {product.ageBadge}
                      </div>
                    </div>
                    <div className="font-extrabold text-sm text-on-surface shrink-0">
                      {STORE_SETTINGS.currency}
                      {product.price.toFixed(2)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-surface-container-high relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              className="sticky top-0 float-right w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low">
                  <img
                    src={
                      selectedProduct.images[selectedImageIdx] ||
                      selectedProduct.images[0]
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                          selectedImageIdx === idx
                            ? 'border-primary-container'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                    {selectedProduct.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                    {selectedProduct.ageBadge}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-on-surface">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs font-semibold text-on-surface-variant">
                  {selectedProduct.tagline}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-on-surface">
                    {STORE_SETTINGS.currency}
                    {selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-outline line-through">
                      {STORE_SETTINGS.currency}
                      {selectedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold">
                    <Star className="w-4 h-4 fill-primary-container text-primary-container" />
                    {selectedProduct.rating.toFixed(1)} (
                    {selectedProduct.reviewCount})
                  </span>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="p-3 rounded-2xl bg-surface-container-low text-xs flex flex-col gap-1">
                  <div>
                    <span className="font-bold text-on-surface">Material: </span>
                    <span className="text-on-surface-variant">
                      {selectedProduct.material}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-on-surface">Safety: </span>
                    <span className="text-on-surface-variant">
                      {selectedProduct.safetyCertification}
                    </span>
                  </div>
                </div>

                {selectedProduct.insideTheBox.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-outline mb-1.5">
                      Inside the Box
                    </h4>
                    <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside">
                      {selectedProduct.insideTheBox.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-2.5 pt-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="btn-tactile flex-1 py-3 px-5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-sm shadow-tactile flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    aria-label="Toggle wishlist"
                    className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted(selectedProduct.id)
                          ? 'text-tertiary fill-tertiary'
                          : 'text-on-surface-variant'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Cart & WhatsApp Guest Checkout Drawer */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={handleCloseCart}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-md h-full flex flex-col shadow-2xl border-l border-surface-container-high"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-extrabold text-lg text-on-surface">
                  {checkoutStep === 'cart'
                    ? `Your Toy Bag (${totalItems})`
                    : checkoutStep === 'checkout'
                    ? 'Guest WhatsApp Checkout'
                    : 'Order Sent to WhatsApp!'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {checkoutStep === 'cart' && items.length > 0 && (
              <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-700">
                      You unlocked FREE Express Toy Delivery! 🎉
                    </span>
                  ) : (
                    <span className="text-on-surface-variant">
                      Add{' '}
                      <span className="text-on-surface font-extrabold">
                        {STORE_SETTINGS.currency}
                        {freeShippingRemaining.toFixed(2)}
                      </span>{' '}
                      more for FREE shipping
                    </span>
                  )}
                  <span className="text-outline">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full bg-primary-container transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {checkoutStep === 'success' && lastOrder ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-on-surface">
                      Order #{lastOrder.id} Ready!
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      WhatsApp has been opened with your itemized order for{' '}
                      <span className="font-bold text-on-surface">
                        {STORE_SETTINGS.currency}
                        {lastOrder.total.toFixed(2)}
                      </span>
                      .
                    </p>
                  </div>
                  {lastOrder.whatsappUrl && (
                    <a
                      href={lastOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile w-full py-3 px-5 rounded-full bg-green-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Re-open WhatsApp Message</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutStep('cart');
                      setIsCartOpen(false);
                    }}
                    className="text-xs font-bold text-secondary hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-14 gap-3">
                  <ShoppingBag className="w-12 h-12 text-outline" />
                  <h3 className="font-extrabold text-base text-on-surface">
                    Your toy bag is empty
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-xs">
                    Explore our wooden blocks, STEM kits, and organic plush pals
                    to start building your cart.
                  </p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="flex flex-col gap-3.5">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-3 p-3 rounded-2xl bg-surface-container-low border border-surface-container"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-surface-container"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-on-surface truncate">
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="text-outline hover:text-tertiary transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-on-surface-variant mt-0.5">
                          {STORE_SETTINGS.currency}
                          {product.price.toFixed(2)} each
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="inline-flex items-center gap-2 bg-surface-container-lowest rounded-full px-2 py-1 border border-surface-container-high">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-container"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-extrabold w-5 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-container"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-extrabold text-sm text-on-surface">
                            {STORE_SETTINGS.currency}
                            {(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form
                  id="whatsapp-checkout-form"
                  onSubmit={handleCheckoutSubmit}
                  className="flex flex-col gap-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) =>
                        setCustomer({ ...customer, fullName: e.target.value })
                      }
                      placeholder="Parent or recipient name"
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, phone: e.target.value })
                        }
                        placeholder="+1 555 019 2834"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) =>
                          setCustomer({ ...customer, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                      placeholder="Street, apartment, landmark"
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.city}
                        onChange={(e) =>
                          setCustomer({ ...customer, city: e.target.value })
                        }
                        placeholder="City"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.postalCode}
                        onChange={(e) =>
                          setCustomer({
                            ...customer,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="ZIP / PIN"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Payment Preference
                    </label>
                    <select
                      value={customer.paymentPreference}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          paymentPreference: e.target
                            .value as CustomerDetails['paymentPreference'],
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                    >
                      <option value="whatsapp_cod">
                        Cash on Delivery (Pay upon arrival)
                      </option>
                      <option value="whatsapp_upi">
                        Instant UPI / Direct Transfer
                      </option>
                      <option value="card_online">
                        Card / Online Payment Link
                      </option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={customer.isGift}
                      onChange={(e) =>
                        setCustomer({ ...customer, isGift: e.target.checked })
                      }
                      className="rounded accent-primary-container"
                    />
                    <span>Include free gift wrap &amp; personal note 🎁</span>
                  </label>

                  {customer.isGift && (
                    <textarea
                      rows={2}
                      value={customer.giftMessage}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          giftMessage: e.target.value,
                        })
                      }
                      placeholder="Write a warm birthday or holiday message..."
                      className="w-full p-3 rounded-xl bg-surface-container-low text-sm font-medium outline-none border border-transparent focus:border-secondary"
                    />
                  )}
                </form>
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && checkoutStep !== 'success' && (
              <div className="p-4 sm:p-5 border-t border-surface-container bg-surface-container-low flex flex-col gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-bold text-on-surface">
                      {STORE_SETTINGS.currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="font-bold text-on-surface">
                      {shipping === 0
                        ? 'FREE'
                        : `${STORE_SETTINGS.currency}${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-on-surface pt-1 border-t border-surface-container">
                    <span>Total</span>
                    <span>
                      {STORE_SETTINGS.currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('checkout')}
                    className="btn-tactile w-full py-3.5 px-5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-sm shadow-tactile flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Guest Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3 rounded-full bg-surface-container text-on-surface font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="whatsapp-checkout-form"
                      className="btn-tactile flex-1 py-3 px-4 rounded-full bg-green-600 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 hover:brightness-105"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Order to WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showConfigModal && (
        <WhatsAppConfigModal onClose={() => setShowConfigModal(false)} />
      )}
    </div>
  );
}

