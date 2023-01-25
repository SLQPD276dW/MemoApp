declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      SECRET: string;

      NEXT_PUBLIC_MEMO_COUNT_MAX: number;
      NEXT_PUBLIC_MEMO_TITLE_LENGTH_MAX: number;
      NEXT_PUBLIC_MEMO_CONTENT_LENGTH_MAX: number;

      NEXT_PUBLIC_BASE_URL: string;
    }
  }
}

export {};
