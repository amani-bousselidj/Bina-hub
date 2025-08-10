"use client";

import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { ensureI18n } from "./i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureI18n();
  }, []);

  // Keep document direction synced with language
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", i18n.language);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
