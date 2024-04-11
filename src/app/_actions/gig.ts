"use server";

import type { GetGigsProps } from "@/types/index";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { gigMultiEventSchema, gigSchema } from "@/lib/validations/gig";
import {
  type FormState,
  fromErrorToFormState,
  toFormState,
} from "@/components/form/to-form-state";
import { combineDateTimeToISOString, parseFormData } from "@/lib/utils";
import { redirect } from "next/navigation";
import { setCookieByKey } from "./cookies";
import { unstable_noStore as noStore } from "next/cache";
import { type Gig } from "@prisma/client";
import { getClient } from "./client";

// import { type Gig } from "@prisma/client";

export async function getGig(id: string) {
  noStore();
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
  noStore();
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
  noStore();
  revalidatePath(`/`);
  revalidatePath("/dashboard/gigs/");
  revalidatePath(`/dashboard/gigs/${id}`);
  redirect(`/dashboard/gigs/${id}`);
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

export async function copyGig(copyFromId: string): Promise<Gig> {
  if (!copyFromId)
    return { result: "Error", resultDescription: "Missing params" };

  const gig = await getGig(copyFromId);
  if (!gig) {
    return { result: "Error", resultDescription: "Gig not found. " };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { santa, mrsSanta, id, ...gigWithoutSanta } = gig;

  return await prisma.gig.create({
    data: {
      id: undefined,
      copiedFromId: copyFromId,
      ...gigWithoutSanta,
    },
  });
}

export async function submitMultiEventForm(
  copyFromId: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!copyFromId || !formData) return toFormState("ERROR", "Missing params");

  try {
    const parsedData = parseFormData(formData, gigMultiEventSchema);

    if (parsedData) {
      const gig = await copyGig(copyFromId);

      if (!gig) {
        return toFormState("ERROR", "Gig not found ");
      }

      const data = {
        gigDate: formData.get("gigDate") as string | null,
        timeStart: formData.get("timeStart") as string | null,
        timeEnd: formData.get("timeEnd") as string | null,
      };

      if (data.gigDate && data.timeStart && data.timeEnd) {
        const gigDateObj = new Date(data.gigDate);
        const gigDateISO = gigDateObj.toISOString();
        const timeStartISO = combineDateTimeToISOString(
          gigDateObj,
          data.timeStart,
        );
        const timeEndISO = combineDateTimeToISOString(gigDateObj, data.timeEnd);

        await prisma.gig.update({
          data: {
            gigDate: gigDateISO,
            timeStart: timeStartISO,
            timeEnd: timeEndISO,
          },
          where: { id: gig.id },
        });
        revalidatePath(`/dashboard/gigs/`);
        revalidatePath(`/dashboard/gigs/${gig.id}`);
      }
    }
  } catch (error) {
    return fromErrorToFormState(error);
  }

  return toFormState("SUCCESS", "Gig created successfully");
  // return toFormState("ERROR", "Missing required form data");
}

export async function copyInfoFromClient(id: string) {
  const gig = await getGig(id);

  if (!gig?.clientId)
    return { result: "Error", resultDescription: "No client assigned to gig" };

  const client = await getClient(gig?.clientId);

  await prisma.gig.update({
    where: {
      id,
    },
    data: {
      venueAddressCity: client?.addressCity,
      venueAddressState: client?.addressState,
      venueAddressStreet: client?.addressStreet,
      venueAddressZip: client?.addressZip,
      contactName: client?.contact,
      contactPhoneCell: client?.phoneCell,
      contactPhoneLand: client?.phoneLandline,
      contactEmail: client?.email,
      notesVenue: client?.notes,
    },
  });

  revalidatePath(`/dashboard/gigs/`);
  revalidatePath(`/dashboard/gigs/${id}`);
  // redirect(`/dashboard/gigs/${id}`);

  return { result: "Success", resultDescription: "Gig updated. " };
}
