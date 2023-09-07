"use server";

import {
  prisma,
  type GigProps,
  type ClientProps,
  type SourceProps,
} from "@/server/db";

import { revalidatePath } from "next/cache";
import { fromUTC, toUTC } from "@/lib/utils";
import { getSantas } from "./source";
import { type Prisma } from "@prisma/client";
import { type GetGigsProps, type GigExtendedProps } from "@/types/index";
import { redirect } from "next/navigation";

// import * as z from "zod";

/**TODO: create an array here with the whereClause, sort, etc. so we have one funciton to getGigs 
 * i.e. 
 * const = [
 * {name: upcoming,
 * whereClause: {
      gigDate: { gte: today },

 * 
 * }, 
 * orderBy...,
 * take..
 * 
 }
 * ]
 */

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
          nameFirst: true,
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

      // client: {
      //   select: {
      //     id: true,
      //     client: true,
      //     addressCity: true,
      //     addressState: true,
      //     addressStreet: true,
      //     addressZip: true,
      //     clientType: true,
      //     contact: true,
      //     source: true,
      //     phoneCell: true,
      //     phoneLandline: true,
      //     email: true,
      //     notes: true,

      //   },
      // },
    },
    where: {
      id: id,
    },
  });

  if (data?.gigDate) {
    const localGigDate = fromUTC(data.gigDate);
    data.gigDate = localGigDate;
  }

  if (data?.timeStart) {
    const newTime = fromUTC(data?.timeStart);
    data.timeStart = newTime;
  }

  if (data?.timeEnd) {
    const newTime = fromUTC(data?.timeEnd);
    data.timeEnd = newTime;
  }

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
    data: data.map(mapGig),
    totalCount,
  };
}

function mapGig(gig: GigProps) {
  if (gig.gigDate) {
    const localGigDate = fromUTC(gig.gigDate);
    gig.gigDate = localGigDate;
  }
  // if (gig.createdAt) {
  //   const localCreatedAt = fromUTC(gig.createdAt);
  //   gig.createdAt = localCreatedAt;
  // }

  if (gig?.timeStart) {
    const newTime = fromUTC(gig?.timeStart);
    gig.timeStart = newTime;
  }

  if (gig?.timeEnd) {
    const newTime = fromUTC(gig?.timeEnd);
    gig.timeEnd = newTime;
  }

  return gig;
}

export async function create(props?: GigProps) {
  let data = {};
  if (props) {
    data = { data: props };
  }

  const newRecord = await prisma.gig.create({ data: { id: undefined } });

  revalidatePath(`/dashboard/gigs/`);
  return newRecord.id;
}

export async function update(
  props: Partial<GigProps> & { client?: { update: Partial<ClientProps> } }
) {
  console.log(props);
  const data = { ...props };
  const include: Prisma.GigInclude = {};

  if (props.clientId) {
    data.client = { connect: { id: props.clientId } };
    delete data.clientId;

    include.client = true;
  }

  if (props.mrsSantaId) {
    data.mrsSanta = { connect: { id: props.mrsSantaId } };
    delete data.mrsSantaId;
    include.mrsSanta = true;
  }
  if (props.santaId) {
    data.santa = { connect: { id: props.santaId } };
    delete data.santaId;
    include.santa = true;
  }
  const res = (await prisma.gig.update({
    data: data,
    where: { id: props.id },
    include: include ? include : undefined,
  })) as GigExtendedProps;
  console.log(res);

  props.id && revalidatePath(`/dashboard/gigs/${props.id}`);
  revalidatePath(`/dashboard/gigs/`);
  // props.id && redirect(`/dashboard/gigs/${props.id}`);
  console.log("here", res);

  return res;
}

export async function getAvailableSantas(id: string) {
  const gig = await prisma.gig.findFirst({
    where: { id: id },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  const { gigDate, timeStart, timeEnd } = gig;

  if (!gigDate || !timeStart || !timeEnd)
    throw new Error("Gig date, start time, or end time not found.");

  const dateStart = new Date(gigDate.getTime());
  dateStart.setHours(timeStart.getHours(), timeStart.getMinutes());

  const dateEnd = new Date(gigDate.getTime());
  dateEnd.setHours(timeEnd.getHours(), timeEnd.getMinutes());

  const santas = await getSantas();

  const santaIds = santas.map((santa) => santa.id);

  const bookedSantas = await prisma.gig.findMany({
    where: {
      AND: [
        { gigDate },
        {
          OR: [
            { timeStart: { lte: dateStart, gte: dateEnd } },
            { timeEnd: { lte: dateStart, gte: dateEnd } },
          ],
        },
        { santaId: { in: santaIds } },
      ],
    },
  });

  const bookedSantaIds = bookedSantas.map((gig) => gig.santaId);

  const availableSantas = santas.filter(
    (santa) => !bookedSantaIds.includes(santa.id)
  );

  return { available: availableSantas, unavailable: bookedSantas };

  const data = await prisma.source.findMany({
    select: {
      id: true,
      role: true,
      nameFirst: true,
      nameLast: true,
    },
    where: {
      status: "Active",
      role: {
        contains: "RBS",
      },
    },
    orderBy: {
      role: "asc",
    },
  });

  return data;
}
