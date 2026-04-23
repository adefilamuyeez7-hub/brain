import { ClerkProvider } from '@clerk/clerk-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Graceful fallback when Clerk is not configured
  if (!publishableKey) {
    console.warn(
      '⚠️ Clerk authentication key missing. Running without authentication. Set VITE_CLERK_PUBLISHABLE_KEY in .env.local to enable.'
    );
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
