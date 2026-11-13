import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PrivacyBanner } from "@/components/layout/PrivacyBanner";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "CreatorEDF — Free Export & Payment Documents for Indian Creators",
  description:
    "Free tool for Indian creators, YouTubers, and freelancers to create RBI EDF Forms, Export Invoices, and Bank AD Code Letters.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <ThemeProvider>
          <LanguageProvider>
            <PrivacyBanner />
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
