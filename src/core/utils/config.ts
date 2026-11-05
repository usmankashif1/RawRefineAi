// Set EXPO_PUBLIC_API_URL in .env (variables prefixed EXPO_PUBLIC_ are inlined at build time).
export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';
export const GEMINI_API_KEY: string | undefined = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
