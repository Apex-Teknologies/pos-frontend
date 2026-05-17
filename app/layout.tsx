import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: 'ApexTek POS', template: '%s | ApexTek POS' },
  description: 'Smart Point of Sale System by ApexTek — inventory, sales, customers, and analytics in one place.',
  keywords: ['POS', 'point of sale', 'inventory', 'sales', 'retail', 'ApexTek'],
  authors: [{ name: 'ApexTek' }],
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
  openGraph: {
    title: 'ApexTek POS',
    description: 'Smart Point of Sale System',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
