"use server";

import { type ClientProps, prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { type GetClientsProps } from "@/types/index";
import { fromUTC } from "@/lib/utils";

export async function getClients({
  select = { id: true, client: true },
  whereClause = {},
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
    // console.log(localCreatedAt);
  }

  return client;
}

export async function checkIfExists(name: string) {
  name = name.toLowerCase().trim();
  const client = await prisma.client.findFirst({
    where: {
      client: {
        contains: name,
      },
    },
  });

  console.log("check if exists", name, client, !!client, client?.id);

  return {
    result: "Success",
    resultDescription: client
      ? "Client already exists."
      : "Client does not exist.",
    clientId: client?.id,
    isDuplicate: !!client,
  };
}

export async function createClient(props: Partial<ClientProps>) {
  if (!props.client)
    return { result: "Error", resultDescription: "Client name is required." };

  const resultExists = await checkIfExists(props.client);
  if (resultExists.isDuplicate) {
    return resultExists;
  }
  const client = await prisma.client.create({ data: props });

  revalidatePath(`/dashboard/clients/`);

  return {
    result: "Success",
    resultDescription: "Client created succesfully",
    clientId: client?.id,
  };
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
