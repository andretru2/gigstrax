"use server";

import { type ClientProps, prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { type Prisma } from "@prisma/client";
import { type GetClientsProps } from "@/types/index";
import { fromUTC } from "@/lib/utils";

export async function getClient(id: string): Promise<ClientProps | null> {
  if (id.length === 0) return null;

  const data = await prisma.client.findFirst({
    select: {
      id: true,
      client: true,
      clientType: true,
      contact: true,
      phoneCell: true,
      email: true,
      addressCity: true,
      addressState: true,
      addressStreet: true,
      addressZip: true,
      source: true,
      notes: true,
      phoneLandline: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,

      updatedBy: true,
      status: true,
      _count: {
        select: {
          gigs: true,
        },
      },
    },
    where: {
      id: id,
    },
  });

  return data;
}

export async function getClients({
  select = { id: true, client: true },
  whereClause = {},
  // orderBy = [{ client: "asc" }],
  orderBy = [],
  limit = 10,
  skip = 0,
}: GetClientsProps) {
  const totalCount = await prisma.client.count({ where: whereClause });

  const data = await prisma.client.findMany({
    select: select,
    where: whereClause,
    orderBy: orderBy,
    take: limit,
    skip: skip,
  });

  return {
    data: data.map(mapClient),
    totalCount,
  };
}

function mapClient(client: ClientProps) {
  if (client.createdAt) {
    const localCreatedAt = fromUTC(client.createdAt);
    client.createdAt = localCreatedAt;
    console.log(localCreatedAt);
  }

  return client;
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

  return;

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
  revalidatePath(`/dashboard/clients/`);
  return newRecord.id;
}

export async function update(props: Partial<ClientProps>) {
  const client = await prisma.client.findFirst({
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
  revalidatePath(`/dashboard/clients/`);

  // return data;
}
