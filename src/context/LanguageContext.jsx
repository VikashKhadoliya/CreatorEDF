"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, SUPPORTED_LANGUAGES } from "@/lib/translations";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  languages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("creatoredf_lang");
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    } catch (e) {
      // LocalStorage unavailable
    }
    setMounted(true);
  }, []);

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem("creatoredf_lang", langCode);
      } catch (e) {}
    }
  };

  const t = (key) => {
    const currentLangDict = translations[language] || translations.en;
    if (currentLangDict && currentLangDict[key] !== undefined) {
      return currentLangDict[key];
    }
    // Fallback to English
    return translations.en[key] !== undefined ? translations.en[key] : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        mounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

