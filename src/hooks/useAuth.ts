import { useUser, useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { useCallback } from "react";

/**
 * Custom hook for authentication status and user information
 * Integrates with Clerk for real authentication
 */
export function useAuthUser() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const isLoaded = isUserLoaded && isAuthLoaded;

  // Get first name for greeting
  const firstName = user?.firstName || "there";
  
  // Get user email
  const email = user?.primaryEmailAddress?.emailAddress || "";
  
  // Get user avatar URL
  const avatarUrl =
    user?.profileImageUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
  
  // Get full name
  const fullName = user?.fullName || "User";

  // Get user stats (mock for now, connect to API later)
  const stats = {
    ideas: user?.unsafeMetadata?.ideasCount ? Number(user.unsafeMetadata.ideasCount) : 0,
    sparks: user?.unsafeMetadata?.sparksCount ? Number(user.unsafeMetadata.sparksCount) : 0,
    following: user?.unsafeMetadata?.followingCount ? Number(user.unsafeMetadata.followingCount) : 0,
  };

  // Get user bio
  const bio = (user?.unsafeMetadata?.bio as string) || "";

  return {
    isSignedIn,
    isLoaded,
    user,
    firstName,
    email,
    avatarUrl,
    fullName,
    stats,
    bio,
    signIn,
    signUp,
  };
}
