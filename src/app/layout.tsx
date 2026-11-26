import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Toast from '@/components/Toast';

export const metadata: Metadata = {
  title: 'WonderToys — Pure Play, Zero Clutter | ToyCart',
  description:
    'Thoughtfully curated, safety-certified wooden, STEM, plush, and creative toys for curious kids. Instant guest checkout via WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-surface text-on-surface min-h-screen">
        <CartProvider>
          {children}
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}

