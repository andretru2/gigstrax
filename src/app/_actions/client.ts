"use server";

import { prisma, type SourceProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";

export async function getClient(id: string) {
  if (id.length === 0) return null;

  const data = await prisma.client.findFirst({
    select: {
      id: true,
    },
    where: {
      id: id,
    },
  });

  return data;
}

export async function getClients() {
  return await prisma.client.findMany({
    select: {
      id: true,
      client: true,
    },
    // where: {
    //   status: "Active",
    //   role: {
    //     contains: "RBS",
    //   },
    // },
    orderBy: {
      client: "asc",
    },
    take: 10,
  });
}
