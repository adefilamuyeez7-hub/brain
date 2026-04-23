import { ClerkProvider } from '@clerk/clerk-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Graceful fallback for development without Clerk
  if (!publishableKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '[Dev Mode] Clerk key missing. Running without authentication.'
      );
      return <>{children}</>;
    }
    throw new Error(
      'Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Set it in .env.local'
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
