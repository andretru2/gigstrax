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
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { orgCreate, orgFilter } from "@/lib/auth/orgUtils";
import { type Prisma } from "@prisma/client";

export async function getClient(id: string): Promise<ClientProps | null> {
  noStore();
  if (id.length === 0) return null;

  const whereClauseWithOrg = await orgFilter<Prisma.ClientWhereInput>({
    whereClause: { id: id },
  });

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
      orgId: true,

      updatedBy: true,
      status: true,
      _count: {
        select: {
          gigs: true,
        },
      },
    },
    where: whereClauseWithOrg,
  });

  return data;
}

export async function getClients({
  select = { id: true, client: true },
  whereClause = {},
  orderBy = [],
  limit = 10,
  skip = 0,
}: GetClientsProps) {
  noStore();

  const whereClauseWithOrg = await orgFilter<Prisma.ClientWhereInput>({
    whereClause: whereClause,
  });

  const totalCount = await prisma.client.count({ where: whereClauseWithOrg });

  const data = await prisma.client.findMany({
    select: select,
    where: whereClauseWithOrg,
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
  // console.log("check if exists", name, client, !!client, client?.id);

  return {
    result: "Success",
    resultDescription: client
      ? "Client already exists."
      : "Client does not exist.",
    clientId: client?.id,
    isDuplicate: !!client,
  };
}

interface CreateClientProps {
  client: Partial<Prisma.ClientCreateInput>;
  goto?: boolean | undefined;
}
export async function createClient(props: CreateClientProps) {
  if (!props.client)
    return { result: "Error", resultDescription: "Client name is required." };

  const resultExists = await checkIfExists(props.client.client ?? "");
  if (resultExists.isDuplicate) {
    return resultExists;
  }
  const definedProps = Object.fromEntries(
    Object.entries(props.client).filter(([_, v]) => v !== undefined),
  ) as Prisma.ClientCreateInput;

  const dataWithOrg = await orgCreate<Prisma.ClientCreateInput>({
    data: definedProps,
  });

  const client = await prisma.client.create({ data: dataWithOrg });

  revalidatePath(`/dashboard/clients/`);

  if (props.goto) redirect(`/dashboard/clients/${client?.id}`);

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
  revalidatePath(`/`);
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
