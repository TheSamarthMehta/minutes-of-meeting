import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Redirect to login page with error
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (!user.email) {
            return false;
          }

          // Auto-provision user on first Google sign-in.
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name?.trim() || "Google User",
                image: user.image,
                role: "STAFF",
              },
            });
            console.log(`[Google Signup] Created user ${user.email}`);
            return true;
          }

          // Keep profile fields fresh on repeat logins.
          const shouldUpdateName =
            !!user.name && user.name.trim() && user.name !== existingUser.name;
          const shouldUpdateImage = user.image !== existingUser.image;

          if (shouldUpdateName || shouldUpdateImage) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                ...(shouldUpdateName ? { name: user.name!.trim() } : {}),
                ...(shouldUpdateImage ? { image: user.image } : {}),
              },
            });
          }

          console.log(`[Google Login Success] User ${user.email} authenticated`);
          return true;
        } catch (error) {
          console.error("[Google Auth Error]", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, account }) {
      // For OAuth sign-in, fetch user data from database using email
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      }

      // For Credentials sign in, user object will have all data
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role || "STAFF";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
      }

      // Check if we need to fetch updated user data
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STAFF" | "MANAGER" | "ADMIN";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
