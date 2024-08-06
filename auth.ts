import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { validateUserOrganizationAccess } from "@/app/_actions/auth/user-validation";

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
      const authStatus = await validateUserOrganizationAccess(user.id);
      // const memberships = await prisma.membership.findMany({
      //   where: {
      //     userId: user.id,
      //     isActive: true,
      //   },
      //   select: {
      //     id: true,
      //     orgId: true,
      //     isSelected: true,
      //   },
      // });

      // let selectedOrgId = memberships.find((m) => m.isSelected)?.orgId;

      // // If no organization is selected, use the first active one by default
      // if (!selectedOrgId && memberships.length > 0) {
      //   selectedOrgId = memberships[0]?.orgId;
      // }

      console.log("session", session, authStatus, user);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name: user.name,
          role: user.role,
          // orgId: selectedOrgId,
          orgId: authStatus.selectedOrgId,
        },
      };
    },

    signIn: async ({ user, account, profile, email }) => {
      console.log(user, account, profile, email);
      if (
        account?.provider === "resend" &&
        email?.verificationRequest === true
      ) {
        return true;
      }

      const userData = await prisma.user.findUnique({ where: { id: user.id } });
      if (!userData) return true; // Allow first-time login

      if (!userData.isActive) return false;
      if (userData.role === "SUPERADMIN") return true;

      const authStatus = await validateUserOrganizationAccess(userData.id);
      return authStatus.isActive;
    },
  },
});

if (false) {
  async function getOrCreateAuthForUserx(
    userId: string,
  ): Promise<Response<void>> {
    //get all orgs and memberships for user.
    let isNewUser = false;
    let selectedOrgId;
    let isActive = false;
    const resultBase = {
      isActive: isActive,
      isNewUser: isNewUser,
      selectedOrgId: selectedOrgId,
    };
    let memberships = await prisma.membership.findMany({
      where: { userId: userId },
    });
    let organizations = await prisma.organization.findMany({
      where: {
        id: { in: memberships.map((membership) => membership.orgId) },
      },
    });

    if (!memberships && !organizations) isNewUser = true;

    if (!isNewUser) {
      console.log("existing user");

      if (!memberships.some((membership) => membership.isActive === true)) {
        //Does the user have at least one active membership? if not, exit.
        console.log("No active memberships");
        return {
          result: "ERROR",
          description: "Trial expired (No active memberships)",
          ...resultBase,
        };
      }

      if (
        !organizations.some((organization) => organization.isActive === true)
      ) {
        //Does the user have at least one active organization? if not, exit.
        console.log("no active orgs");
        return {
          result: "ERROR",
          description: "Trial expired (no active orgs)",
          ...resultBase,
        };
      }

      //By now, the user has at least one active organization. Ensure the trial has not expired. (today > trailEndDate ). If so, inactivate it and exit.
      await Promise.all(
        organizations.map(async (organization) => {
          if (
            organization?.trialEndDate &&
            new Date() > organization?.trialEndDate
          ) {
            // If the trial has expired, inactivate the organization and related memberships
            await prisma.organization.update({
              where: { id: organization.id },
              data: {
                isActive: false,
                memberships: {
                  updateMany: {
                    where: { isActive: true }, // Only update active memberships
                    data: { isActive: false },
                  },
                },
              },
            });
          }
        }),
      );

      //Check if at least one org's trial period still valid.
      const activeOrgs = await prisma.organization.findMany({
        where: {
          AND: {
            id: { in: memberships.map((membership) => membership.orgId) },
            isActive: true,
          },
        },
      });

      if (!activeOrgs) {
        console.log("no active orgs");
        return {
          result: "ERROR",
          description: "Trial expired (no active orgs)",
          ...resultBase,
        };
      }

      isActive = true;
      return {
        result: "SUCCESS",
        description: "User has access",
        ...resultBase,
      };
    }

    if (isNewUser) {
      const user = await prisma.user.findFirst({
        where: { id: userId },
      });

      const start = new Date();
      const end = new Date(start.getTime() + 48 * 60 * 60 * 1000);

      const organization = await prisma.organization.create({
        data: {
          name: user?.name ?? user?.email ?? "",
          trialStartDate: start,
          trialEndDate: end,
          isActive: true,
          createdAt: new Date(),
          createdBy: user?.id,
          updatedAt: new Date(),
          updatedBy: user?.id,
        },
      });

      const membership = await prisma.membership.create({
        data: {
          userId: user?.id,
          orgId: organization.id, // Assuming the field is named 'organizationId'
          isActive: true,
          isSelected: true,
          createdAt: new Date(),
          createdBy: user?.id,
          updatedAt: new Date(),
          updatedBy: user?.id,
        },
      });

      memberships = [membership];
      organizations = [organization];
    }

    selectedOrgId = memberships.find((m) => m.isSelected)?.orgId;

    // If no organization is selected, use the first active one by default
    if (!selectedOrgId && memberships.length > 0) {
      selectedOrgId = memberships[0]?.orgId;
    }

    console.log(memberships, organizations, selectedOrgId);
    return {
      result: "SUCCESS",
      description: "User has access",
      ...resultBase,
    };
  }
}
