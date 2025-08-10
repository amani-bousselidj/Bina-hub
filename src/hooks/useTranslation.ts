// Translation Hook
import { useState, useEffect } from 'react';

interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}

interface UseTranslationReturn {
  t: (key: string, fallback?: string) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
}

// Mock translation data
const translations: Record<string, TranslationMessages> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      confirm: 'Confirm'
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      projects: 'Projects',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up'
    },
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      signInToAccount: 'Sign in to your account',
      createAccount: 'Create an account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?"
    }
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال',
      confirm: 'تأكيد'
    },
    nav: {
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      projects: 'المشاريع',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب'
    },
    auth: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      signInToAccount: 'تسجيل الدخول إلى حسابك',
      createAccount: 'إنشاء حساب جديد',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
      dontHaveAccount: 'ليس لديك حساب؟'
    }
  }
};

export function useTranslation(): UseTranslationReturn {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  const setLanguage = (lang: string): void => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', lang);
      
      // Update document direction for RTL languages
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  return {
    t,
    currentLanguage,
    setLanguage,
    isLoading
  };
}

export default useTranslation;


