"use server";

import type { GetGigsProps } from "@/types/index";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { gigSchema } from "@/lib/validations/gig";
import {
  type FormState,
  fromErrorToFormState,
  toFormState,
} from "@/components/form/to-form-state";
import { toCent } from "@/utils/currency";
// import type {Gig} from "@prisma/client";

import { ZodError, type ZodIssue, ZodObject, type ZodSchema } from "zod";

function parseFormData<T extends Record<string, unknown>>(
  formData: FormData,
  schema: ZodSchema<T>,
): T {
  if (!(schema instanceof ZodObject)) {
    throw new Error("Schema must be a ZodObject");
  }
  const keys = Array.from(formData.keys()) as Array<keyof T>;
  const dataEntries: [keyof T, unknown][] = keys.map((key) => {
    try {
      const value = formData.get(key.toString());
      const parsedValue = schema.shape[key].parse(value);
      return [key, parsedValue];
    } catch (error) {
      const zodError = ZodError.create(
        (error as ZodError<T>).issues.map(
          (issue): ZodIssue => ({
            ...issue,
            path: [key, ...issue.path],
          }),
        ),
      );
      console.log(zodError, "zodError");
      throw zodError;
    }
  });

  return Object.fromEntries(dataEntries) as T;
}

export async function update(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!id) return toFormState("ERROR", "Gig not found");

  try {
    const parsedData = parseFormData(formData, gigSchema);

    if (parsedData)
      await prisma.gig.update({
        where: {
          id,
        },
        data: { id: id, ...parsedData },
      });
  } catch (error) {
    console.log(error);
    return fromErrorToFormState(error);
  }

  revalidatePath(`/dashboard/gigs/${id}`);

  // if (id) {
  //   cookies().set("toast", "Ticket updated");

  //   redirect(ticketPath(id));
  // }

  return toFormState("SUCCESS", "Gig updated");
}

export async function getGigs({
  select = { id: true },
  whereClause = {},
  orderBy = [],
  limit = 10,
  skip = 0,
}: GetGigsProps) {
  const totalCount = await prisma.gig.count({ where: whereClause });

  const data = await prisma.gig.findMany({
    select: select,
    where: whereClause,
    orderBy: orderBy,
    take: limit,
    skip: skip,
  });

  return {
    data: data,
    totalCount,
  };
}
