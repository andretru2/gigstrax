"use server";

import { prisma, type SourceProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";

export async function getSource(id: string) {
  if (id.length === 0) return null;

  const data = await prisma.source.findFirst({
    select: {
      id: true,
    },
    where: {
      id: id,
    },
  });

  return data;
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
