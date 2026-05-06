"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// This is a client component that provides the session context to all children
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
