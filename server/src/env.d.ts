

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URL: string;
      SECRET_KEY: string;
      PORT: number;
    }
  }
}

export { }