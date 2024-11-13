// config.ts
interface Config {
    apiBaseUrl: string;
  }
  
  const config: Config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  };
  
  export default config;
  