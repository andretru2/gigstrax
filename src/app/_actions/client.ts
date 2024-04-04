"use server";

import { type ClientProps, prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { type GetClientsProps } from "@/types/index";
import {
  type FormState,
  fromErrorToFormState,
  toFormState,
} from "@/components/form/to-form-state";
import { fromUTC, parseFormData } from "@/lib/utils";
import { clientSchema } from "@/lib/validations/client";
import { unstable_noStore as noStore } from "next/cache";

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

export async function saveClient(
  id: string,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, clientSchema);

    if (parsedData)
      /** TODO: if gig date changes, update timestart/end */
      await prisma.client.update({
        where: {
          id,
        },
        data: { id: id, ...parsedData },
      });
  } catch (error) {
    return fromErrorToFormState(error);
  }
  revalidatePath(`/dashboard/clients/${id}`);

  return toFormState("SUCCESS", "Client updated");
}

export async function submitClient(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, clientSchema);

    if (parsedData)
      await prisma.client.update({
        where: {
          id,
        },
        data: { id: id, ...parsedData },
      });
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(`/dashboard/clients/${id}`);

  return toFormState("SUCCESS", "Client updated");
}

function mapClient(client: ClientProps) {
  if (client.createdAt) {
    const localCreatedAt = fromUTC(client.createdAt);
    client.createdAt = localCreatedAt;
    // console.log(localCreatedAt);
  }

  return client;
}
