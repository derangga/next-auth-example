import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma-client";
import bcrypt from "bcrypt";
import { environment } from "@/lib/environment";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "User Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credential) => {
        try {
          if (!credential?.email || !credential?.password) return null;
          const user = await prisma.user.findUnique({
            where: { email: credential?.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });

          if (!user) return null;
          const isValid = await bcrypt.compare(
            credential?.password,
            user.password || ""
          );
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error(`[ERROR]: ${error}`);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
