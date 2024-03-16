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

// interface Props {
//   id: string;
//   formState: FormState;
//   formData: FormData;
// }

export async function update(
  id: string,
  _formState: { message: string },
  formData: FormData,
) {
  if (!id) return;

  try {
    const data = gigSchema.parse({
      // gigDate: formData.get("gigDate"),
      price: formData.get("price"),
    });

    const dbData = {
      price: toCent(data.price),
      ...data,
    };

    // const data = Object.entries(formData).reduce((acc, [key, value]) => {
    //   if (value) {
    //     acc[key] = value;
    //   }
    //   return acc;
    // });
    console.log(data, "data");

    await prisma.gig.update({
      where: {
        id,
      },
      data: dbData,
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
