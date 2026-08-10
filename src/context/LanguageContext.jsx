import React, { createContext, useContext, useEffect, useState } from "react";

import en from "../translations/en";
import kn from "../translations/kn";

const LanguageContext = createContext(null);

const translations = { en, kn };

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved === "en" ? "en" : "kn";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage) => {
    if (newLanguage === "en" || newLanguage === "kn") {
      setLanguageState(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}