import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name}® · ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}®`,
  },
  description: siteConfig.description,
  applicationName: `${siteConfig.name}®`,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: `${siteConfig.name}®`,
    title: `${siteConfig.name}® · ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}® · ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <CartProvider>
          <Header />
          <main id="contenido" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <RevealObserver />
        </CartProvider>
      </body>
    </html>
  );
}
