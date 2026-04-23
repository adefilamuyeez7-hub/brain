import { useCallback } from "react";

/**
 * Safe authentication hook that works with or without Clerk configured
 * Returns user data from Clerk if available, otherwise returns sensible defaults
 */
export function useAuthUser() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Default values when Clerk is not configured
  const defaults = {
    user: null,
    firstName: "there",
    email: "",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    fullName: "User",
    stats: { ideas: 0, sparks: 0, following: 0 },
    bio: "",
    isSignedIn: false,
    isLoaded: true,
  };

  // If Clerk key is not configured, return defaults immediately
  if (!publishableKey) {
    return {
      ...defaults,
      signOut: () => {}, // No-op function
      isClerkConfigured: false,
    };
  }

  // Clerk is configured, but we still need to handle the case where ClerkProvider
  // isn't in the tree (which shouldn't happen, but we'll be defensive)
  let user: any = null;
  let isSignedIn = false;
  let isLoaded = false;
  let signOut: (() => void) | null = null;

  try {
    // These imports are safe because we checked VITE_CLERK_PUBLISHABLE_KEY exists
    const { useUser, useAuth } = require("@clerk/clerk-react");
    
    // Try to get Clerk state
    try {
      const clerkUser = useUser();
      const clerkAuth = useAuth();

      user = clerkUser?.user;
      isSignedIn = clerkAuth?.isSignedIn;
      isLoaded = clerkUser?.isLoaded && clerkAuth?.isLoaded;
      signOut = clerkAuth?.signOut;
    } catch (hookError) {
      // useUser/useAuth failed - ClerkProvider probably not in tree
      // Return defaults with Clerk configured flag
      console.debug("[Auth] Clerk hooks failed (ClerkProvider may not be available)");
      return {
        ...defaults,
        signOut: () => {},
        isClerkConfigured: true,
      };
    }
  } catch (importError) {
    // Clerk module import failed
    console.debug("[Auth] Clerk import failed");
    return {
      ...defaults,
      signOut: () => {},
      isClerkConfigured: false,
    };
  }

  // Build user data from Clerk or defaults
  const firstName = user?.firstName || defaults.firstName;
  const email = user?.primaryEmailAddress?.emailAddress || defaults.email;
  const avatarUrl =
    user?.profileImageUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || "default"}`;
  const fullName = user?.fullName || defaults.fullName;

  const stats = {
    ideas: user?.unsafeMetadata?.ideasCount ? Number(user.unsafeMetadata.ideasCount) : 0,
    sparks: user?.unsafeMetadata?.sparksCount ? Number(user.unsafeMetadata.sparksCount) : 0,
    following: user?.unsafeMetadata?.followingCount ? Number(user.unsafeMetadata.followingCount) : 0,
  };

  const bio = (user?.unsafeMetadata?.bio as string) || "";

  const safeSignOut = useCallback(() => {
    if (signOut) {
      try {
        signOut();
      } catch (error) {
        console.error("[Auth] Sign out failed:", error);
      }
    }
  }, [signOut]);

  return {
    isSignedIn: isSignedIn || false,
    isLoaded: isLoaded || false,
    user,
    firstName,
    email,
    avatarUrl,
    fullName,
    stats,
    bio,
    signOut: safeSignOut,
    isClerkConfigured: !!publishableKey,
  };
}
