import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    // jwt: async ({ token, account, user }) => {
    //   // force log out banned users
    //   if (!token.email) {
    //     return {};
    //   }

    //   if (user) {
    //     token.user = user;
    //   }

    //   console.log("token", token, account, user);

    //   // Refresh the user's data if they update their name / email
    //   if (account && account.provider === "google") {
    //     const refreshedUser = await prisma.user.findUnique({
    //       where: { id: token.sub },
    //     });

    //     if (refreshedUser) {
    //       token.user = refreshedUser;
    //     } else {
    //       return {};
    //     }
    //   }

    //   return token;
    // },
    // jwt: ({ token, account, user, trigger }) => {
    //   // force log out banned users
    //   if (!token.email) {
    //     return {};
    //   }

    //   if (user) {
    //     token.user = user;
    //   }

    // refresh the user's data if they update their name / email
    // if (trigger === "update") {
    //   const refreshedUser = await prisma.user.findUnique({
    //     where: { id: token.sub },
    //   });
    //   if (refreshedUser) {
    //     token.user = refreshedUser;
    //   } else {
    //     return {};
    //   }
    // }
    // console.log("token", token);

    // return token;
    // },
    // signIn: ({ user, account, profile }) => {
    //   console.log(user, account, profile);
    //   if (!user.email) {
    //     return false;
    //   }

    // const userExists = await prisma.user.findUnique({
    //   where: { email: user.email },
    //   select: { name: true },
    // });
    // // if the user already exists via email,
    // // update the user with their name and image from Google
    // if (userExists && !userExists.name) {
    //   await prisma.user.update({
    //     where: { email: user.email },
    //     data: {
    //       name: profile?.name,
    //       // @ts-ignore - this is a bug in the types, `picture` is a valid on the `Profile` type
    //       image: profile?.picture,
    //     },
    //   });
    // }

    // return true;
    // },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
