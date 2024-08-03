import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { toast } from "sonner";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      orgId: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Resend({
      from: "santa@realbeardsantas.com",
    }),
  ],

  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    session: async ({ session, user }) => {
      const memberships = await prisma.membership.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        select: {
          id: true,
          orgId: true,
          isSelected: true,
        },
      });

      let selectedOrgId = memberships.find((m) => m.isSelected)?.orgId;

      // If no organization is selected, use the first active one by default
      if (!selectedOrgId && memberships.length > 0) {
        selectedOrgId = memberships[0]?.orgId;
      }

      console.log(memberships, user, session);

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name: user.name,
          role: user.role,
          orgId: selectedOrgId,
        },
      };
    },
    authorized: ({ auth, request }) => {
      console.log(auth, request);
      return true;
    },

    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log(user, account, profile, email, credentials);

      const userData = await prisma.user.findFirst({
        where: { id: user.id },
      });

      console.log(userData);

      if (
        account?.provider === "resend" &&
        email?.verificationRequest === true &&
        !userData
      ) {
        console.log("verficiation");
        return true;
      }
      console.log("yes");
      // redirect("/dashboard/gigs");
      // return true;

      let memberships = await prisma.membership.findMany({
        where: { userId: user.id },
      });
      let organizations = await prisma.organization.findMany({
        where: {
          id: { in: memberships.map((membership) => membership.orgId) },
        },
      });

      console.log(userData, memberships, organizations);
      if (!userData) return true; //we need to return true if its the first time logging on.
      if (!userData?.isActive) {
        toast.error(
          "Sorry, you don't access to the system. Please email andretru2@gmail.com for assistance.",
        );
        return false;
      }

      //can access as long as its superadmin but has an active account.
      if (userData.role === "SUPERADMIN") return true;

      //is it a new user? we can determine if memberships and organizations are empty.
      let isNewUser = false;
      if (memberships.length === 0 || organizations.length === 0) {
        isNewUser = true;

        const start = new Date();
        const end = new Date(start.getTime() + 48 * 60 * 60 * 1000);

        try {
          const organization = await prisma.organization.create({
            data: {
              name: userData.name ?? userData.email ?? "",
              trialStartDate: start,
              trialEndDate: end,
              isActive: true,
              createdAt: new Date(),
              createdBy: userData.id,
              updatedAt: new Date(),
              updatedBy: userData.id,
            },
          });

          const membership = await prisma.membership.create({
            data: {
              userId: user.id,
              orgId: organization.id, // Assuming the field is named 'organizationId'
              isActive: true,
              isSelected: true,
              createdAt: new Date(),
              createdBy: userData.id,
              updatedAt: new Date(),
              updatedBy: userData.id,
            },
          });

          memberships = [membership];
          organizations = [organization];
        } catch (error) {
          console.error("Error creating organization or membership:", error);

          return false; // or handle the error in a way that makes sense for your application
        }
      }

      //check if it has at least one active membership.
      if (!isNewUser) {
        console.log("not new ");
        if (!memberships.some((membership) => membership.isActive === true)) {
          toast.error(
            "Sorry, you don't have access to the system. Please email andretru2@gmail.com for assistance.",
          );
          console.log("no active memb ");

          return false;
        }
        if (!organizations.some((org) => org.isActive === true)) {
          toast.error(
            "Sorry, you don't have access to the system. Please email andretru2@gmail.com for assistance.",
          );
          console.log("no active org ");
          return false;
        }
      }

      console.log("made it here", user);

      return true;
    },
  },
});
