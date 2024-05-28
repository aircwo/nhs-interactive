declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DB_STORE: boolean;
      DB_URL: string;
      DB_ACCESS_KEY: string;
      HEALTH_AI_API_URL: string;
      HEALTH_AI_API_KEY: string;
      HEALTH_AI_API_HEALTH_CHECK_URL: string;
      API_VERSION: string|number;
      NEXT_PUBLIC_SERVER_URL: string;
    }
  }
}

export {}
