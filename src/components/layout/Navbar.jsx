"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  FileText,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  FileSpreadsheet,
  Landmark,
  User,
  Building2,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toolsRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand */}
          <Logo showTagline={true} />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Home Pill */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                pathname === "/"
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("navHome")}
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>{t("navTools")}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    toolsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Free Document Tools
                  </div>
                  <Link
                    href="/document-generator?tool=edf"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 transition"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-0.5 shrink-0 flex items-center justify-center">
                      <img src="/assets/tool-edf.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-semibold">{t("navEdf")}</div>
                      <div className="text-[10px] text-slate-400">RBI Annexure for Foreign Wire Payouts</div>
                    </div>
                  </Link>

                  <Link
                    href="/document-generator?tool=invoice"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 transition"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-0.5 shrink-0 flex items-center justify-center">
                      <img src="/assets/tool-invoice.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-semibold">{t("navInvoice")}</div>
                      <div className="text-[10px] text-slate-400">GST Rule 46 / 96A Commercial Bill</div>
                    </div>
                  </Link>

                  <Link
                    href="/document-generator?tool=ad_letter"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 transition"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-0.5 shrink-0 flex items-center justify-center">
                      <img src="/assets/tool-ad-code.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-semibold">{t("navAdCode")}</div>
                      <div className="text-[10px] text-slate-400">Request Letter for Bank Branch</div>
                    </div>
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <Link
                    href="/document-generator"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t("navAllTools")} (Batch PDF / ZIP)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* EDF Guide Anchor Link */}
            <Link
              href="/#edf-guide"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              EDF Guide
            </Link>

            {/* Guides Link */}
            <Link
              href="/guides"
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition ${
                pathname === "/guides"
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("navGuides")}
            </Link>

            {/* What's New Link */}
            <Link
              href="/#whats-new"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              What&apos;s New
            </Link>

            {/* FAQs Link */}
            <Link
              href="/guides#faqs"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t("navFaqs")}
            </Link>
          </nav>

          {/* Right Action Bar: Language Selector & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">{activeLang.nativeName}</span>
                <span className="text-[10px] text-slate-400">({activeLang.name})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Select Language (10 Indian Languages)
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition ${
                        language === l.code
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-sm">{l.nativeName}</span>
                      <span className="text-[11px] text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
              title={t("toggleTheme")}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t("navHome")}
            </Link>

            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Document Tools
              </div>
              <Link
                href="/document-generator?tool=edf"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                • {t("navEdf")}
              </Link>
              <Link
                href="/document-generator?tool=invoice"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                • {t("navInvoice")}
              </Link>
              <Link
                href="/document-generator?tool=ad_letter"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                • {t("navAdCode")}
              </Link>
              <Link
                href="/document-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                • {t("navAllTools")}
              </Link>
            </div>

            <Link
              href="/#edf-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              EDF Guide
            </Link>

            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("navGuides")}
            </Link>

            <Link
              href="/#whats-new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              What&apos;s New
            </Link>

            <Link
              href="/guides#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("navFaqs")}
            </Link>
          </nav>

          {/* Language selector in mobile menu */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Select Language:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition ${
                    language === l.code
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>{l.nativeName}</div>
                  <div className="text-[9px] text-slate-400">{l.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
