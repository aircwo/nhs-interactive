declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DB_STORE: boolean;
      DB_URL: string;
      DB_ACCESS_KEY: string;
      HEALTH_AI_API_URL: string;
      HEALTH_AI_API_KEY: string;
    }
  }
}

export {}
