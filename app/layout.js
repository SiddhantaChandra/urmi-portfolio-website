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
  title: "Urmi Chakraborty - Journalist Turned Content Writer",
  description: "From interviewing Bollywood celebrities to crafting SEO-driven content strategies. I bring 2+ years of editorial excellence to brand storytelling.",
  keywords: "content writer, journalist, SEO content, brand storytelling, editorial, content strategy",
  author: "Urmi Chakraborty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
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
