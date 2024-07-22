import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log(user, account, profile, email, credentials);

      const userExists = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true },
      });

      console.log("exists", userExists);

      return true;

      if (false) {
        if (!user.email) {
          return false;
        }

        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
          select: { name: true },
        });

        if (!userExists) return false;
        // if the user already exists via email,
        // update the user with their name and image from Google

        console.log("login success", user, account, profile);

        await prisma.user.update({
          where: { email: user.email },
          data: {
            name: profile?.name,
          },
        });

        return true;
      }
      return true;
    },
  },
});
