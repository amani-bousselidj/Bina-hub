// @ts-nocheck
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/navigation" />

export {};




