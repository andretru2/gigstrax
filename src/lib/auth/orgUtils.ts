// import { Prisma } from "@prisma/client";
import { auth } from "auth";

interface FilterParams<T> {
  whereClause?: T;
}

//
export async function orgFilter<T extends Record<string, unknown>>({
  whereClause = {} as T,
}: FilterParams<T>): Promise<T> {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized");

  // Super Admin can see all records, so return the original whereClause without modification
  if (session?.user.role === "SUPERADMIN") return whereClause;

  return {
    ...whereClause,
    orgId: session.user.orgId,
  };
}

interface CreateParams<T> {
  data: T;
}

export async function orgCreate<T extends Record<string, unknown>>({
  data = {} as T,
}: CreateParams<T>): Promise<T> {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized");

  if (session?.user.role === "SUPERADMIN") return data;

  return {
    ...data,
    orgId: session.user.orgId,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  };
}
