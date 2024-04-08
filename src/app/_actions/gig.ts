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
import { parseFormData } from "@/lib/utils";
import { redirect } from "next/navigation";
import { setCookieByKey } from "./cookies";
// import { type Gig } from "@prisma/client";

export async function getGig(id: string) {
  if (id.length === 0) return null;

  const data = await prisma.gig.findFirst({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      santa: {
        select: {
          id: true,
          role: true,
        },
      },
      mrsSanta: {
        select: {
          id: true,
          role: true,
        },
      },
      price: true,
      amountPaid: true,
      santaId: true,
      mrsSantaId: true,
      clientId: true,

      venueAddressCity: true,
      venueAddressName: true,
      venueAddressState: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,
      venueAddressZip: true,

      venueType: true,
      contactName: true,
      contactEmail: true,

      contactPhoneCell: true,
      contactPhoneLand: true,
      notesVenue: true,
    },
    where: {
      id: id,
    },
  });

  // return data as Gig[];
  return data;
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

export async function saveGig(
  id: string,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, gigSchema);

    if (parsedData)
      /** TODO: if gig date changes, update timestart/end */
      await prisma.gig.update({
        where: {
          id,
        },
        data: { id: id, ...parsedData },
      });
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath("/dashboard/gigs/");
  revalidatePath(`/dashboard/gigs/${id}`);
  return toFormState("SUCCESS", "Gig updated");

  if (id) {
    setCookieByKey("toast", "Gig updated");
    redirect(`/dashboard/gigs/${id}`);
  }

  revalidatePath("/dashboard/gigs/");
  revalidatePath(`/dashboard/gigs/${id}`);

  return toFormState("SUCCESS", "Gig updated");

  // noStore();
  // const clientId = formData.get("clientId") as string;

  // revalidatePath(`/dashboard/gigs/`);
  // revalidatePath(`/dashboard/clients/`);
  revalidatePath(`/dashboard/gigs/${id}`);
  setCookieByKey("Gig", "Gig updated");
  redirect(`/dashboard/gigs/${id}`);
  // if (clientId) revalidatePath(`/dashboard/clients/${clientId}`);

  return toFormState("SUCCESS", "Gig updated");
}

export async function submitGig(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!id || !formData) return toFormState("ERROR", "Missing params");

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
    return fromErrorToFormState(error);
  }

  revalidatePath(`/dashboard/gigs/${id}`);

  return toFormState("SUCCESS", "Gig updated");
}

export async function createGig() {
  // let data = {};
  // if (props) {
  //   data = { data: props };
  // }

  const gig = await prisma.gig.create({ data: { id: undefined } });

  revalidatePath(`/dashboard/gigs/`);
  redirect(`/dashboard/gigs/${gig.id}`);
  return gig;
}
