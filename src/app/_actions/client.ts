"use server";

import { type ClientProps, prisma, type SourceProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";
import { type Prisma } from "@prisma/client";

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

export async function getClients({
  whereClause = {},
  limit = 25,
}: {
  whereClause?: Prisma.ClientWhereInput;
  limit?: number;
}) {
  return await prisma.client.findMany({
    select: {
      id: true,
      client: true,
    },

    where: whereClause,

    orderBy: {
      client: "asc",
    },

    take: limit,

    // take: 10,
  });
}

export async function checkIfExists(name: string) {
  name.toLowerCase().trim();
  const exists = await prisma.client.findFirst({
    where: {
      client: {
        contains: name,
      },
    },
  });

  if (exists?.id) return true;

  // return exists?.id;
  // if (exists) {
  //   throw new Error("Client name already taken.");
  // }
}

export async function create(data: ClientProps) {
  const exists = await checkIfExists(data.client);
  if (exists) {
    throw new Error("Client name already taken.");
  }
  const newRecord = await prisma.client.create({ data: data });
  return newRecord.id;
}

export async function update(props: Partial<ClientProps>) {
  const client = await prisma.gig.findFirst({
    where: { id: props.id },
  });

  if (!client) {
    throw new Error("Client not found.");
  }

  await prisma.client.update({
    data: props,
    where: { id: props.id },
  });

  // console.log("actions", data);

  revalidatePath(`/dashboard/clients/${client.id}`);

  // return data;
}
