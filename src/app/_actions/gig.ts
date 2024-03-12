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

interface Props {
  id: string | undefined;
  _formState: FormState;
  formData: FormData;
}

export async function update(props: Props) {
  const { id, formData } = props;
  try {
    const data = gigSchema.parse({
      gigDate: formData.get("gigDate"),
    });

    await prisma.gig.update({
      where: {
        id,
      },
      data: data,
    });
  } catch (error) {
    // return false;
    return fromErrorToFormState(error);
  }

  revalidatePath(`/dashboard/gigs/${id}`);

  // if (id) {
  //   cookies().set("toast", "Ticket updated");

  //   redirect(ticketPath(id));
  // }

  return toFormState("SUCCESS", "Ticket created");
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
