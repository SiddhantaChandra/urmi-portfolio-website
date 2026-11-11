import "lenis/dist/lenis.css";
import "./globals.css";
import localFont from "next/font/local";
import SeoAnalytics from "../components/SeoAnalytics";
import SmoothScroll from "../components/SmoothScroll";
import { measurementId } from "../lib/analytics.mjs";
import { creator, getSeoConfig } from "../lib/seo.mjs";

const { siteUrl, indexable } = getSeoConfig();

const editorial = localFont({
  src: [
    {
      path: "../components/reels/assets/serif-roman.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../components/reels/assets/serif-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia"],
});
const sans = localFont({
  src: "../components/reels/assets/sans-roman.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["Arial"],
});
const japanese = localFont({
  src: "./fonts/noto-serif-jp-subset.woff2",
  weight: "400",
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata = {
  title: creator.title,
  description: creator.description,
  metadataBase: new URL(siteUrl),
  ...(siteUrl && {
    alternates: { canonical: "/" },
  }),
  authors: [{ name: creator.name, url: creator.instagram }],
  creator: creator.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Urmi · @uwummie",
    title: creator.title,
    description: creator.description,
    ...(siteUrl && { url: `${siteUrl}/` }),
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Urmi Chakraborty · Anime & manga storytelling · @uwummie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: creator.title,
    description: creator.description,
    images: [
      {
        url: "/og-image.jpg",
        alt: "Urmi Chakraborty · Anime & manga storytelling · @uwummie",
      },
    ],
  },
  robots: { index: indexable, follow: indexable },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${sans.variable} ${japanese.variable} h-full antialiased`}
    >
      <head>
        {indexable && measurementId && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f5ee] text-[#1c1917] relative">
        <div className="noise" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
        {indexable && measurementId && <SeoAnalytics />}
      </body>
    </html>
  );
}
