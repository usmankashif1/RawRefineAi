// Set EXPO_PUBLIC_API_URL in .env (variables prefixed EXPO_PUBLIC_ are inlined at build time).
export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';
