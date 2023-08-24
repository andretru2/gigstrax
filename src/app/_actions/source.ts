"use server";

import { prisma, type SourceProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";
import { type Prisma } from "@prisma/client";

export async function getSource(id: string) {
  if (id.length === 0) return null;

  const data = await prisma.source.findFirst({
    select: {
      id: true,
      role: true,
      nameFirst: true,
      nameLast: true,
      phoneCell: true,
      email: true,
      addressCity: true,
      addressState: true,
      addressStreet: true,
      addressZip: true,
      notes: true,
      phoneLandline: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      dob: true,
      updatedBy: true,
      status: true,
      _count: {
        select: {
          gigs: true,
        },
      },
      entity: true,

      phone: true,
      resource: true,
      website: true,
      ssn: true,
      videoUrl: true,
      gender: true,
      costume: true,
    },
    where: {
      id: id,
    },
  });

  return data;
}

export async function getSources({
  select = { id: true, nameFirst: true, nameLast: true },
  whereClause = {},
  orderBy = [{ nameLast: "asc" }, { nameFirst: "asc" }],
  limit = 10,
}: {
  select?: Prisma.SourceSelect;
  whereClause?: Prisma.SourceWhereInput;
  orderBy?: Prisma.SourceOrderByWithRelationInput[];
  limit?: Prisma.SourceFindManyArgs["take"];
}) {
  return await prisma.source.findMany({
    select: select,
    where: whereClause,
    orderBy: orderBy,
    take: limit,
  });
}

export async function getSantas() {
  return await prisma.source.findMany({
    select: {
      id: true,
      role: true,
    },
    where: {
      status: "Active",
      role: {
        contains: "RBS",
      },
    },
    orderBy: {
      role: "asc",
    },
  });
}

export async function getMrsSantas() {
  return await prisma.source.findMany({
    select: {
      id: true,
      nameFirst: true,
    },
    where: {
      status: "Active",
      role: {
        contains: "Mrs",
      },
    },
    orderBy: {
      role: "asc",
    },
  });
}

export async function checkIfExists({
  nameFirst,
  nameLast,
}: {
  nameFirst: string;
  nameLast: string;
}) {
  nameFirst.toLowerCase().trim();
  nameLast.toLowerCase().trim();

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

export async function create(data: SourceProps) {
  const exists = await checkIfExists({
    nameFirst: data.nameFirst,
    nameLast: data.nameFirst,
  });
  if (exists) {
    throw new Error("Source name already exists.");
  }
  const newRecord = await prisma.source.create({ data: data });
  return newRecord.id;
}

export async function update(props: Partial<SourceProps>) {
  const source = await prisma.source.findFirst({
    where: { id: props.id },
  });

  if (!source) {
    throw new Error("Source not found.");
  }

  await prisma.source.update({
    data: props,
    where: { id: props.id },
  });

  // console.log("actions", data);

  revalidatePath(`/dashboard/sources/${source.id}`);

  // return data;
}
