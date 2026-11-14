"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  FileText,
  FileSpreadsheet,
  Landmark,
  Layers,
  Home,
  Compass,
  BookOpen,
  Sparkles,
  HelpCircle,
  User,
  Building2,
  Calculator,
  CheckCircle2,
  Archive,
  ChevronDown,
  ChevronRight,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Check,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Desktop dropdown states
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Mobile drawer & language modal states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState("");

  const toolsRef = useRef(null);
  const langRef = useRef(null);

  // Close desktop dropdowns on click outside
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangModalOpen(false);
    setToolsDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer or language modal is open
  useEffect(() => {
    if (mobileMenuOpen || langModalOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [mobileMenuOpen, langModalOpen]);

  // Handle Escape key to close open drawer / modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (langModalOpen) {
          setLangModalOpen(false);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        } else {
          setToolsDropdownOpen(false);
          setLangDropdownOpen(false);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, langModalOpen]);

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  // Filter languages in modal
  const filteredLanguages = useMemo(() => {
    if (!langSearchQuery.trim()) return languages;
    const q = langSearchQuery.toLowerCase().trim();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [languages, langSearchQuery]);

  // Navigation Links Configuration
  const mainNavItems = [
    { label: t("navHome") || "Home", href: "/", icon: Home },
    { label: "EDF Guide", href: "/#edf-guide", icon: Compass },
    { label: t("navGuides") || "Guides", href: "/guides", icon: BookOpen },
    { label: "What's New", href: "/#whats-new", icon: Sparkles },
    { label: t("navFaqs") || "FAQs", href: "/guides#faqs", icon: HelpCircle },
  ];

  const documentTools = [
    {
      label: t("navEdf") || "RBI EDF Form Generator",
      href: "/document-generator?tool=edf",
      badge: "Form EDF",
      sub: "Statutory Section 2B Annexure",
      icon: FileText,
      asset: "/assets/tool-edf.png",
    },
    {
      label: t("navInvoice") || "Export Invoice Generator",
      href: "/document-generator?tool=invoice",
      badge: "GST/LUT",
      sub: "Commercial Zero-Rated Bill",
      icon: FileSpreadsheet,
      asset: "/assets/tool-invoice.png",
    },
    {
      label: t("navAdCode") || "Bank AD Code Letter",
      href: "/document-generator?tool=ad_letter",
      badge: "Forex Desk",
      sub: "Request letter for bank branch",
      icon: Landmark,
      asset: "/assets/tool-ad-code.png",
    },
    {
      label: t("navAllTools") || "All-in-One Generator",
      href: "/document-generator",
      badge: "Batch ZIP",
      sub: "Generate all 3 documents together",
      icon: Layers,
      asset: "/assets/pdf-download.png",
    },
  ];

  const workspaceTools = [
    { label: "Exporter Profile", href: "/exporter-profile", icon: User },
    { label: "Recipient Profiles", href: "/recipient-profiles", icon: Building2 },
    { label: "Revenue Tracker", href: "/revenue-tracker", icon: Calculator },
    { label: "Payment Reconciliation", href: "/payment-reconciliation", icon: CheckCircle2 },
    { label: "Downloads Archive", href: "/downloads", icon: Archive },
  ];

  return (
    <>
      {/* =========================================================================
          STICKY HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo & Brand */}
            <Logo showTagline={true} size="normal" />

            {/* Desktop Navigation Links (>= md) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              {/* Home */}
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition ${
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
                  aria-expanded={toolsDropdownOpen}
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
                    {documentTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 transition"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-0.5 shrink-0 flex items-center justify-center">
                          <img src={tool.asset} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="font-semibold">{tool.label}</div>
                          <div className="text-[10px] text-slate-400">{tool.sub}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* EDF Guide */}
              <Link
                href="/#edf-guide"
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                EDF Guide
              </Link>

              {/* Guides */}
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

              {/* What's New */}
              <Link
                href="/#whats-new"
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                What&apos;s New
              </Link>

              {/* FAQs */}
              <Link
                href="/guides#faqs"
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t("navFaqs")}
              </Link>
            </nav>

            {/* Desktop Right Action Bar: Language Selector & Theme Toggle */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs"
                  aria-label="Select language"
                  aria-expanded={langDropdownOpen}
                >
                  <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold">{activeLang.nativeName}</span>
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
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold"
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
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-2xs"
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

            {/* Mobile Actions: Language Button, Theme Toggle & Hamburger */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
              {/* Compact Language Button */}
              <button
                type="button"
                onClick={() => setLangModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 active:scale-95 transition shadow-2xs"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-[11px] font-bold">{activeLang.nativeName}</span>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95 transition shadow-2xs"
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center active:scale-95 transition shadow-2xs ${
                  mobileMenuOpen
                    ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-600 dark:text-teal-400"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER OVERLAY
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop Tap Target */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <aside
            className="relative w-[88vw] max-w-sm sm:max-w-md bg-white dark:bg-slate-950 border-l border-slate-200/90 dark:border-slate-800/90 shadow-2xl flex flex-col justify-between overflow-hidden z-10 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] animate-in slide-in-from-right duration-300 ease-out"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <Logo showTagline={false} size="small" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition active:scale-90"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
              {/* SECTION 1: MAIN NAVIGATION */}
              <div className="space-y-1.5">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Main Navigation
                </div>
                <div className="space-y-1">
                  {mainNavItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : item.href.startsWith("/#")
                        ? pathname === "/" && typeof window !== "undefined" && window.location.hash === item.href.substring(1)
                        : pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition active:scale-[0.98] ${
                          isActive
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold border-l-4 border-teal-600 shadow-2xs"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-teal-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: DOCUMENT TOOLS */}
              <div className="space-y-1.5">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Document Tools
                </div>
                <div className="space-y-1.5">
                  {documentTools.map((tool) => {
                    const isToolActive =
                      pathname === "/document-generator" &&
                      (tool.href === "/document-generator"
                        ? typeof window !== "undefined" && !window.location.search.includes("tool=")
                        : typeof window !== "undefined" && window.location.search.includes(tool.href.split("?")[1]));

                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition active:scale-[0.98] ${
                          isToolActive
                            ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs"
                            : "border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 p-1 shrink-0 flex items-center justify-center shadow-2xs">
                            <img src={tool.asset} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {tool.label}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">
                              {tool.sub}
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 uppercase tracking-wide shrink-0">
                          {tool.badge}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: CREATOR WORKSPACE */}
              <div className="space-y-1.5">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Creator Workspace
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {workspaceTools.map((ws) => {
                    const WsIcon = ws.icon;
                    const isWsActive = pathname === ws.href;
                    return (
                      <Link
                        key={ws.href}
                        href={ws.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition active:scale-95 ${
                          isWsActive
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                            : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <WsIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate">{ws.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer: Language & Privacy Badge */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
              {/* Compact Language Selector Trigger Card */}
              <button
                type="button"
                onClick={() => setLangModalOpen(true)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-teal-500 transition shadow-2xs group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Language / भाषा
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeLang.nativeName}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({activeLang.name})
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-900/40">
                  Change
                </span>
              </button>

              {/* Data Sovereignty Notice */}
              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>100% In-Browser Privacy • No Registration Required</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =========================================================================
          LANGUAGE SELECTION BOTTOM SHEET / MODAL
          ========================================================================= */}
      {langModalOpen && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          {/* Backdrop Tap Target */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setLangModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet Panel */}
          <div
            className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 p-5 sm:p-6 max-h-[85vh] flex flex-col space-y-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Language Selection Dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Select Language / भाषा चुनें
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
                    Supports English + 9 major Indian languages
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition active:scale-90"
                aria-label="Close language selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={langSearchQuery}
                onChange={(e) => setLangSearchQuery(e.target.value)}
                placeholder="Search language name (e.g. Hindi, मराठी)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Language Selection List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[55vh] scrollbar-thin">
              {filteredLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setLangModalOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition active:scale-[0.99] ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/70 dark:bg-teal-950/60 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {l.nativeName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {l.name}
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
