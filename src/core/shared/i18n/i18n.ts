"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      common: {
        loading: "جاري التحميل",
        error: "حدث خطأ",
      },
    },
  },
  en: {
    translation: {
      common: {
        loading: "Loading",
        error: "An error occurred",
      },
    },
  },
};

let initialized = false;

export function ensureI18n() {
  if (initialized) return i18n;
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "ar",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      defaultNS: "translation",
      ns: ["translation"],
      returnNull: false,
    });
  initialized = true;
  return i18n;
}

export default i18n;
