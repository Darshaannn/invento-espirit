// components/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

/**
 * Memoized so re-renders of parent don't re-mount the SessionProvider.
 * This is crucial for performance as SessionProvider handles context.
 */
export const AuthProvider = React.memo(function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
});

AuthProvider.displayName = "AuthProvider";
