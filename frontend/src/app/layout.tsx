// src/app/layout.tsx
import { CartProvider } from '@/context/CartContext';
import './globals.css'; // veya global.css sende hangisi varsa

export const metadata = {
  title: 'ETrade - Premium Alışveriş',
  description: '.NET Core & Next.js E-Commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {/* Bütün uygulamayı sepet koruyucusu ile sarmalıyoruz */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}