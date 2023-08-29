"use server";

import {
  prisma,
  type GigProps,
  type ClientProps,
  type SourceProps,
} from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";
import { fromUTC, toUTC } from "@/lib/utils";
import { getSantas } from "./source";
import { connect } from "http2";
import { type Prisma } from "@prisma/client";
import { type GigExtendedProps } from "@/types/index";

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

      client: {
        select: {
          id: true,
          client: true,
          addressCity: true,
          addressState: true,
          addressStreet: true,
          addressZip: true,
          clientType: true,
          contact: true,
          source: true,
          phoneCell: true,
          phoneLandline: true,
          email: true,
          notes: true,

          contact,
          email,
          id,
          notes,
          phoneCell,
          phoneLandline,
          source,
          createdAt,
          updatedAt,
          createdBy,
          updatedBy,
          status,
        },
      },
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

export async function getUpcoming() {
  const today = new Date();
  const data = await prisma.gig.findMany({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressCity: true,
      venueAddressState: true,
      venueAddressName: true,
      venueAddressZip: true,
      venueAddressStreet: true,

      client: {
        select: {
          client: true,
        },
      },
      santa: {
        select: {
          role: true,
          // fullName: true,
        },
      },
      mrsSanta: {
        select: {
          nameFirst: true,
        },
      },
    },
    where: {
      gigDate: { gte: today },
    },
    take: 10,
    orderBy: {
      gigDate: "asc",
    },
  });

  return data.map((gig) => {
    if (gig.gigDate) {
      const localGigDate = fromUTC(gig.gigDate);
      gig.gigDate = localGigDate;
    }

    if (gig?.timeStart) {
      const newTime = fromUTC(gig?.timeStart);
      gig.timeStart = newTime;
    }

    if (gig?.timeEnd) {
      const newTime = fromUTC(gig?.timeEnd);
      gig.timeEnd = newTime;
    }

    return gig;
  });
}

export async function getRecentlyCreated() {
  // const today = new Date(2022, 12, 31);
  // const fiveDaysAgo = new Date(today);
  // fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 128);
  const data = await prisma.gig.findMany({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressCity: true,
      venueAddressState: true,
      venueAddressName: true,
      venueAddressZip: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,

      client: {
        select: {
          client: true,
          contact: true,
          phoneCell: true,
          phoneLandline: true,
        },
      },
      santa: {
        select: {
          role: true,
          // fullName: true,
        },
      },
      mrsSanta: {
        select: {
          nameFirst: true,
        },
      },
    },
    where: {
      createdAt: { not: null },
    },
    orderBy: {
      createdAt: "desc",
    },

    take: 10,
  });

  return data.map((gig) => {
    if (gig.gigDate) {
      const localGigDate = fromUTC(gig.gigDate);
      gig.gigDate = localGigDate;
    }

    if (gig?.timeStart) {
      const newTime = fromUTC(gig?.timeStart);
      gig.timeStart = newTime;
    }

    if (gig?.timeEnd) {
      const newTime = fromUTC(gig?.timeEnd);
      gig.timeEnd = newTime;
    }

    return gig;
  });
}

export async function getPast() {
  const today = new Date(2022, 12, 31);
  console.log("today", today);
  const data = await prisma.gig.findMany({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressCity: true,
      venueAddressState: true,
      venueAddressName: true,
      venueAddressZip: true,
      venueAddressStreet: true,

      client: {
        select: {
          client: true,
        },
      },
      santa: {
        select: {
          role: true,
          // fullName: true,
        },
      },
      mrsSanta: {
        select: {
          nameFirst: true,
        },
      },
    },
    where: {
      gigDate: {
        lte: today,
      },
    },
    orderBy: {
      gigDate: "desc",
    },
    take: 10,
  });

  return data.map((gig) => {
    if (gig.gigDate) {
      const localGigDate = fromUTC(gig.gigDate);
      gig.gigDate = localGigDate;
    }

    if (gig?.timeStart) {
      const newTime = fromUTC(gig?.timeStart);
      gig.timeStart = newTime;
    }

    if (gig?.timeEnd) {
      const newTime = fromUTC(gig?.timeEnd);
      gig.timeEnd = newTime;
    }

    return gig;
  });
}
export async function create(props?: GigProps) {
  let data = {};
  if (props) {
    data = { data: props };
  }

  const newRecord = await prisma.gig.create({ data: { id: undefined } });

  revalidatePath(`/dashboard/gigs`);
  return newRecord.id;
}

export async function update(
  props: Partial<GigProps> & { client?: { update: Partial<ClientProps> } }
) {
  // const gig = await prisma.gig.findFirst({
  //   where: { id: props.id },
  // });

  // if (props?.timeStart) {
  //   const [hours, minutes] = props?.timeStart.split(":");

  //   const localTime = new Date(
  //     gig?.gigDate?.getFullYear(),
  //     gig?.gigDate?.getMonth(),
  //     gig?.gigDate?.getDate(),
  //     Number(hours),
  //     Number(minutes),
  //     0,
  //     0
  //   );

  //   const date = new Date(gig?.gigDate);
  //   date.setMinutes;
  //   const newTime = toUTC(props?.timeStart.toISOString());
  //   props.timeStart = newTime;
  // }

  // if (props?.timeEnd) {
  //   const newTime = toUTC(props?.timeEnd.toISOString());
  //   props.timeEnd = newTime;
  // }

  // if (!gig) {
  //   throw new Error("Gig not found.");
  // }

  // revalidatePath(`/dashboard/gigs/${gig.id}`);
  // revalidatePath(`/dashboard/gigs`);

  // let data: Prisma.Gig = {};

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
  return res;

  //  const res = await prisma.gig.update({
  //    data: {
  //      // clientId: props.clientId,
  //      client: {
  //        connect: { id: props.clientId },
  //      },
  //      mrsSanta: { id: props.mrsSantaId ?? "" },
  //    },
  //    where: { id: props.id },
  //    include: {
  //      client: true,
  //      santa: true,
  //      mrsSanta: true,
  //    },
  //  });
  console.log(res);

  // const res = await prisma.gig.update({
  //   data: props,
  //   where: { id: props.id },
  // });

  // console.("actions", data);

  // return data;
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
