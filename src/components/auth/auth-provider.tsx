"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null | undefined;
}>) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
