import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  title: "URMI (uwummie) — Japanese Anime Editorial Creator Portfolio",
  description:
    "Awwwards-inspired Wabi-Sabi Japanese anime editorial creator portfolio for Urmi (@uwummie). Thoughtful anime storytelling, in-depth reviews, video essays, and brand collaborations.",
  keywords: [
    "Urmi",
    "uwummie",
    "Anime Critic",
    "Video Essays",
    "Anime & Cosplay",
    "Japanese Editorial Portfolio",
    "Wabi-Sabi Editorial",
  ],
  authors: [{ name: "Urmi", url: "https://www.instagram.com/uwummie" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8f5ee] text-[#1c1917] relative">
        <div className="noise" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
