import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";

export const metadata: Metadata = {
  title: "Foodie",
  description: "Online Food Ordering App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}