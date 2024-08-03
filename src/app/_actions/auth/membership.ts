"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

import type { Membership } from "@prisma/client";

import { fromErrorToResponse, parseFormData } from "@/lib/utils";
import type { GetMembershipsProps, Response } from "@/types/index";
import {
  type CreateMembershipProps,
  createMembershipSchema,
  type UpdateMembershipProps,
  updateMembershipSchema,
} from "@/lib/validations/membership";

export async function getMembership(id: string): Promise<Response<Membership>> {
  if (id.length === 0) {
    return {
      result: "ERROR",
      description: "Invalid Membership ID",
    };
  }

  try {
    const membership = await prisma.membership.findFirst({
      where: { id },
    });

    return {
      result: "SUCCESS",
      description: membership ? "Membership found" : "Membership not found",
      data: membership ? membership : undefined,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function getMemberships({
  select,
  whereClause = {},
  orderBy = [],
  limit = 20,
  skip = 0,
}: GetMembershipsProps): Promise<Response<Membership>> {
  try {
    const [totalCount, memberships] = await prisma.$transaction([
      prisma.membership.count({ where: whereClause }),
      prisma.membership.findMany({
        select: select || undefined,
        where: whereClause,
        orderBy,
        take: limit,
        skip,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    return {
      result: "SUCCESS",
      description: "Memberships fetched successfully",
      data: {
        items: memberships,
        pagination: {
          totalCount,
          pageSize: limit,
          currentPage,
          totalPages,
        },
      },
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function createMembership(
  formData: FormData,
): Promise<Response<Membership>> {
  if (!formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<CreateMembershipProps>(
      formData,
      createMembershipSchema,
    );
    const membership = await prisma.membership.create({
      data: parsedData,
    });

    revalidatePath(`/dashboard/memberships/`);
    revalidatePath(`/dashboard/memberships/${membership.id}`);

    return {
      result: "SUCCESS",
      description: "Membership created successfully",
      data: membership,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function updateMembership(
  id: string,
  formData: FormData,
): Promise<Response<Membership>> {
  if (!id || !formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<UpdateMembershipProps>(
      formData,
      updateMembershipSchema,
    );
    const updatedMembership = await prisma.membership.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath(`/dashboard/memberships/${id}`);

    return {
      result: "SUCCESS",
      description: "Membership updated successfully",
      data: updatedMembership,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}
