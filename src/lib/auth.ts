// Authentication utilities
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simple demo authentication
        // In a real app, you would check against a database
        if (
          credentials?.email === "user@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // Use type assertion to extend the session.user type
        (session.user as any).id = token.sub as string;
      }
      return session;
    },
  },
};