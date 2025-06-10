import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./contexts/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata = {
  title: "Urmi Chakraborty - Journalist & Content Writer",
  description: "From interviewing personalities to tracking pop culture trends across anime, Hollywood, and Bollywood, I bring nearly two years of experience in entertainment journalism and editorial work.",
  keywords: "content writer, journalist, SEO content, brand storytelling, editorial, content strategy, SEO writing, editing, proofreading, Urmi Chakraborty, entertainment journalism, anime, Hollywood, Bollywood, Urmi, Urmi Telegraph, Urmi The Telegraph, Urmi The Telegraph Online, Urmi MyKolkata",
  author: "Urmi Chakraborty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Essential preconnects only */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
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
