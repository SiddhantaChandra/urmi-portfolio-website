import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./contexts/ThemeContext";
import StructuredData from "../components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// Update app/layout.js with SEO-optimized metadata
export const metadata = {
  metadataBase: new URL('https://urmichakraborty.com'),
  
  // Primary SEO
  title: {
    default: "Urmi Chakraborty - Entertainment Journalist & Content Writer | Portfolio",
    template: "%s | Urmi Chakraborty - Journalist & Content Writer"
  },
  
  description: "Urmi Chakraborty: Entertainment journalist with 2+ years at The Telegraph Online. Expert in anime, Hollywood, Bollywood coverage, SEO content writing, and editorial services. Based in Kolkata, India.",
  
  // Keywords targeting your expertise
  keywords: [
    "entertainment journalist",
    "content writer Kolkata", 
    "anime journalist",
    "Bollywood entertainment news",
    "Hollywood reporter",
    "SEO content writer",
    "editorial services",
    "entertainment writer India",
    "The Telegraph journalist",
    "ABP Digital reporter",
    "freelance journalist",
    "content writing portfolio",
    "entertainment news writer",
    "pop culture journalist",
    "media professional India"
  ].join(', '),
  
  author: "Urmi Chakraborty",
  creator: "Urmi Chakraborty",
  publisher: "Urmi Chakraborty",
  
  // Open Graph for social sharing
  openGraph: {
    title: "Urmi Chakraborty - Entertainment Journalist & Content Writer",
    description: "2+ years entertainment journalism experience. Covering anime, Hollywood, Bollywood for The Telegraph Online. Expert SEO content writer and editor.",
    url: 'https://urmichakraborty.com',
    siteName: 'Urmi Chakraborty Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/Urmi.webp',
        width: 1200,
        height: 630,
        alt: 'Urmi Chakraborty - Entertainment Journalist and Content Writer',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "Urmi Chakraborty - Entertainment Journalist & Content Writer",
    description: "Entertainment journalist at The Telegraph Online. Expert in anime, Hollywood, Bollywood coverage + SEO content writing.",
    creator: '@urmic660',
    images: ['/Urmi.webp'],
  },
  
  // Technical SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Additional metadata for better indexing
  alternates: {
    canonical: 'https://urmichakraborty.com',
  },
  
  // Professional categories for better categorization
  category: 'Journalism',
  classification: 'Professional Portfolio',
  
  // Geographic targeting
  other: {
    'geo.region': 'IN-WB',
    'geo.placename': 'Kolkata',
    'geo.position': '22.5726;88.3639',
    'ICBM': '22.5726, 88.3639',
  }
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Corporate-friendly meta tags */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="7 days" />
        <meta name="content-language" content="en" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        
        {/* Business/Professional classification */}
        <meta name="business:contact_data:country_name" content="India" />
        <meta name="business:contact_data:locality" content="Kolkata" />
        
        {/* Security headers for corporate networks */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Remove redundant Google Fonts preconnects since we're using Next.js font optimization */}
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GBZ3Q1ER94"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', 'G-GBZ3Q1ER94');
            `,
          }}
        />
        
        {/* Critical CSS inline - minimal for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            html { 
              scroll-behavior: smooth; 
            }
            body { 
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              overflow-x: hidden;
            }
          `
        }} />
        
        {/* JSON-LD Structured Data */}
        <StructuredData />
      </head>
      <body
        className="antialiased font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
