"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

import type { Prisma, Source } from "@prisma/client";
import {
  toFormState,
  type FormState,
  fromErrorToFormState,
} from "@/components/form/to-form-state";
import { parseFormData } from "@/lib/utils";
import { sourceSchema } from "@/lib/validations/source";
import { type GetSourcesProps } from "@/types/index";
import { redirect } from "next/navigation";
import { orgCreate, orgFilter } from "@/lib/auth/orgUtils";

export async function getSource(id: string) {
  if (id.length === 0) return null;

  const whereClauseWithOrg = await orgFilter<Prisma.SourceWhereInput>({
    whereClause: { id: id },
  });

  const data = await prisma.source.findFirst({
    select: {
      id: true,
      role: true,
      nameFirst: true,
      nameLast: true,
      email: true,
      addressCity: true,
      addressState: true,
      addressStreet: true,
      addressZip: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      dob: true,
      updatedBy: true,
      status: true,

      entity: true,

      phone: true,
      resource: true,
      website: true,
      ssn: true,
      videoUrl: true,
      gender: true,
      costume: true,
      gigMastersAccount: true,
    },
    where: whereClauseWithOrg,
  });

  return data;
}
export async function getSources({
  select = { id: true, nameFirst: true, nameLast: true },
  whereClause = {},
  orderBy = [],
  limit = 20,
  skip = 0,
}: GetSourcesProps) {
  const whereClauseWithOrg = await orgFilter<Prisma.SourceWhereInput>({
    whereClause: whereClause,
  });

  const totalCount = await prisma.source.count({ where: whereClauseWithOrg });

  const data = await prisma.source.findMany({
    select: select,
    where: whereClauseWithOrg,
    orderBy: orderBy,
    take: limit,
    skip: skip,
  });

  return {
    data: data,
    totalCount,
  };
}

export async function checkIfExists({
  nameFirst,
  nameLast,
}: {
  nameFirst: string;
  nameLast: string;
}) {
  nameFirst = nameFirst.toLowerCase().trim();
  nameLast = nameLast.toLowerCase().trim();

  const exists = await prisma.source.findFirst({
    where: {
      nameFirst: {
        contains: nameFirst,
      },
      nameLast: {
        contains: nameLast,
      },
    },
  });

  if (exists?.id) return true;
}

export async function createSource(props: Partial<Prisma.SourceCreateInput>) {
  // const exists = await checkIfExists({
  //   nameFirst: data.nameFirst,
  //   nameLast: data.nameFirst,
  // });
  // if (exists) {
  //   throw new Error("Source name already exists.");
  // }
  // console.log(data);

  if (!props.nameFirst)
    return {
      result: "Error",
      resultDescription: "Role, First Name and Last Name are required.",
    };

  // Create a new object with only the defined properties
  const definedProps = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => v !== undefined),
  ) as Prisma.SourceCreateInput;

  const dataWithOrg = await orgCreate<Prisma.SourceCreateInput>({
    data: definedProps,
  });

  console.log(dataWithOrg, props);

  const source = await prisma.source.create({ data: dataWithOrg });
  revalidatePath(`/dashboard/sources/`);

  return {
    result: "Success",
    resultDescription: "Source created succesfully",
    sourceId: source?.id,
  };
}

export async function saveSource(
  id: string,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, sourceSchema);

    if (parsedData)
      /** TODO: if gig date changes, update timestart/end */
      await prisma.source.update({
        where: {
          id,
        },
        data: { id: id, ...parsedData },
      });
  } catch (error) {
    return fromErrorToFormState(error);
  }
  revalidatePath(`/dashboard/sources/${id}`);

  return toFormState("SUCCESS", "Source updated");
}

export async function submitSource(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!formData) return toFormState("ERROR", "Missing params");

  let source;
  try {
    const parsedData = parseFormData(formData, sourceSchema);

    if (parsedData) {
      source = await createSource(parsedData);
      // source = await prisma.source.create({
      //   data: { ...parsedData },
      // });
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }

  console.log(source);
  revalidatePath(`/dashboard/sources/`);
  source && revalidatePath(`/dashboard/sources/${source.sourceId}`);
  source && redirect(`/dashboard/sources/${source.sourceId}`);
  return toFormState("SUCCESS", "Source created");
}
