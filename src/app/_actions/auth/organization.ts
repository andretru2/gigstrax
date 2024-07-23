"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  toFormState,
  type FormState,
  fromErrorToFormState,
} from "@/components/form/to-form-state";
import { parseFormData } from "@/lib/utils";
import { organizationSchema } from "@/lib/validations/organization";
import { type GetOrganizationsProps } from "@/types/index";

export async function getOrganization(id: string) {
  if (id.length === 0) return null;

  const data = await prisma.organization.findFirst({
    where: { id },
  });

  return data;
}

export async function getOrganizations({
  select,
  whereClause = {},
  orderBy = [],
  limit = 20,
  skip = 0,
}: GetOrganizationsProps) {
  const [totalCount, data] = await prisma.$transaction([
    prisma.organization.count({ where: whereClause }),
    prisma.organization.findMany({
      select: select || undefined,
      where: whereClause,
      orderBy,
      take: limit,
      skip,
    }),
  ]);

  return {
    data,
    totalCount,
  };
}

export async function updateOrganization(
  id: string,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, organizationSchema);

    if (parsedData) {
      await prisma.organization.update({
        where: { id },
        data: parsedData,
      });
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }
  // revalidatePath(`/dashboard/organizations/${id}`);

  return toFormState("SUCCESS", "Organization updated");
}

export async function createOrganization(
  formData: FormData,
): Promise<FormState> {
  if (!formData) return toFormState("ERROR", "Missing params");

  let organization;
  try {
    const parsedData = parseFormData(formData, organizationSchema);
    if (parsedData) {
      organization = await prisma.organization.create({
        data: parsedData,
      });
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }
  // revalidatePath(`/dashboard/organizations/`);
  // organization && revalidatePath(`/dashboard/organizations/${organization.id}`);
  // organization && redirect(`/dashboard/organizations/${organization.id}`);
  return toFormState("SUCCESS", "Organization created");
}
