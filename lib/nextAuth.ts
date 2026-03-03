import NextAuth from "next-auth";
import { authConfig } from "./authConfig";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
