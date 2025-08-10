interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  database: {
    url?: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  features: {
    enableCache: boolean;
    enablePerformanceMonitoring: boolean;
    enableErrorReporting: boolean;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    return {
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      database: {
        url: process.env.DATABASE_URL,
      },
      app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'binaaHub',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: (process.env.NODE_ENV as any) || 'development',
      },
      features: {
        enableCache: process.env.NEXT_PUBLIC_ENABLE_CACHE === 'true',
        enablePerformanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERF_MONITORING === 'true',
        enableErrorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
      },
    };
  }

  get<K extends keyof Config>(section: K): Config[K] {
    return this.config[section];
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  getSupabaseConfig() {
    return this.config.supabase;
  }

  refresh(): void {
    this.config = this.loadConfig();
  }
}

export const config = ConfigManager.getInstance();
export default config;


