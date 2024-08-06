"use server";

import { prisma } from "@/lib/prisma";
import { type User } from "@prisma/client";

type AuthStatus = {
  result: "SUCCESS" | "ERROR";
  description: string;
  isActive: boolean;
  isNewUser: boolean;
  selectedOrgId?: string | null;
};

export async function validateUserOrganizationAccess(
  userId: string,
): Promise<AuthStatus> {
  try {
    // Fetch user, memberships, and organizations in parallel
    const [user, memberships, organizations] = await prisma.$transaction([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.membership.findMany({
        where: { userId },
        select: { orgId: true, isActive: true, isSelected: true },
      }),
      prisma.organization.findMany({
        where: { memberships: { some: { userId } } },
        select: { id: true, isActive: true, trialEndDate: true },
      }),
    ]);

    console.log(user, memberships, organizations);

    if (!user) {
      return createErrorStatus("User not found");
    }

    if (user.role === "SUPERADMIN")
      return {
        result: "SUCCESS",
        description: "User has access",
        isActive: true,
        isNewUser: false,
      };

    if (memberships.length === 0 || organizations.length === 0) {
      console.log("no orgs or membs");
      return createNewUserOrganization(user);
    }

    const orgMap = new Map(organizations.map((org) => [org.id, org]));
    const activeMemberships = memberships.filter(
      (m) => m.isActive && orgMap.get(m.orgId)?.isActive,
    );

    if (activeMemberships.length === 0) {
      return createErrorStatus("No active memberships or organizations");
    }

    // Update expired organizations
    const now = new Date();
    const expiredOrgs = organizations.filter(
      (org) => org.trialEndDate && now > org.trialEndDate,
    );

    if (expiredOrgs.length > 0) {
      await deactivateExpiredOrganizations(expiredOrgs.map((org) => org.id));
    }

    // Recheck active organizations after updating expired ones
    const activeOrgs = organizations.filter(
      (org) => org.isActive && (!org.trialEndDate || now <= org.trialEndDate),
    );

    if (activeOrgs.length === 0) {
      return createErrorStatus("No active organizations");
    }

    const selectedOrgId =
      memberships.find((m) => m.isSelected)?.orgId || activeOrgs[0].id;

    console.log(
      "selected org",
      activeMemberships,
      expiredOrgs,
      activeOrgs,
      selectedOrgId,
    );

    return {
      result: "SUCCESS",
      description: "User has access",
      isActive: true,
      isNewUser: false,
      selectedOrgId,
    };
  } catch (error) {
    console.error("Error in validateUserOrganizationAccess:", error);
    return createErrorStatus("An unexpected error occurred");
  }
}

async function createNewUserOrganization(user: User): Promise<AuthStatus> {
  const start = new Date();
  const end = new Date(start.getTime() + 48 * 60 * 60 * 1000);

  try {
    // // Check for existing membership

    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: {
          contains: user?.email?.split("@")[0], // This will match the part of the email before the '@'
          mode: "insensitive", // This makes the search case-insensitive
        },
      },
    });

    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        orgId: existingOrg?.id,
      },
    });

    console.log(existingMembership, existingOrg);

    if (existingMembership || existingOrg)
      return {
        result: "SUCCESS",
        description: "Dup org/membbersip",
        isNewUser: false,
        isActive: true,
        selectedOrgId: existingOrg?.id,
      };
    3;

    const organization = await prisma.organization.create({
      data: {
        name: user?.name ?? user?.email ?? "",
        trialStartDate: start,
        trialEndDate: end,
        isActive: true,
        createdAt: start,
        createdBy: user.id,
        updatedAt: start,
        updatedBy: user.id,
      },
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        orgId: organization.id,
        isActive: true,
        isSelected: true,
        createdAt: start,
        createdBy: user.id,
        updatedAt: start,
        updatedBy: user.id,
      },
    });

    console.log("created org and memb", organization);

    return {
      result: "SUCCESS",
      description: "New user created with access",
      isNewUser: true,
      isActive: true,
      selectedOrgId: organization.id,
    };
  } catch (error) {
    console.error("Error in createNewUserOrganization:", error);
    return createErrorStatus("Failed to create new user organization");
  }
}

async function deactivateExpiredOrganizations(orgIds: string[]): Promise<void> {
  await prisma.$transaction([
    prisma.organization.updateMany({
      where: { id: { in: orgIds } },
      data: { isActive: false },
    }),
    prisma.membership.updateMany({
      where: { orgId: { in: orgIds }, isActive: true },
      data: { isActive: false },
    }),
  ]);
}

function createErrorStatus(description: string): AuthStatus {
  return {
    result: "ERROR",
    description,
    isActive: false,
    isNewUser: false,
    selectedOrgId: null,
  };
}
