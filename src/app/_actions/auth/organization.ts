"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

import type { Organization } from "@prisma/client";

import { fromErrorToResponse, parseFormData } from "@/lib/utils";
import type { GetOrganizationsProps, Response } from "@/types/index";
import {
  type CreateOrganizationProps,
  createOrganizationSchema,
  type UpdateOrganizationProps,
  updateOrganizationSchema,
} from "@/lib/validations/organization";

export async function getOrganization(
  id: string,
): Promise<Response<Organization>> {
  if (id.length === 0) {
    return {
      result: "ERROR",
      description: "Invalid Organization ID",
    };
  }

  try {
    const organization = await prisma.organization.findFirst({
      where: { id },
    });

    return {
      result: "SUCCESS",
      description: organization
        ? "Organization found"
        : "Organization not found",
      data: organization ? organization : undefined,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function getOrganizations({
  select,
  whereClause = {},
  orderBy = [],
  limit = 20,
  skip = 0,
}: GetOrganizationsProps): Promise<Response<Organization>> {
  try {
    const [totalCount, organizations] = await prisma.$transaction([
      prisma.organization.count({ where: whereClause }),
      prisma.organization.findMany({
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
      description: "Organizations fetched successfully",
      data: {
        items: organizations,
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

export async function createOrganization(
  formData: FormData,
): Promise<Response<Organization>> {
  if (!formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<CreateOrganizationProps>(
      formData,
      createOrganizationSchema,
    );
    const organization = await prisma.organization.create({
      data: parsedData,
    });

    revalidatePath(`/dashboard/Organizations/`);
    revalidatePath(`/dashboard/Organizations/${organization.id}`);

    return {
      result: "SUCCESS",
      description: "Organization created successfully",
      data: organization,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function updateOrganization(
  id: string,
  formData: FormData,
): Promise<Response<Organization>> {
  if (!id || !formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<UpdateOrganizationProps>(
      formData,
      updateOrganizationSchema,
    );
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath(`/dashboard/Organizations/${id}`);

    return {
      result: "SUCCESS",
      description: "Organization updated successfully",
      data: updatedOrganization,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}
