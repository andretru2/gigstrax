"use server";

import { prisma, type GigProps, type ClientProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";
import { fromUTC, toUTC } from "@/lib/utils";
import { getSantas } from "./source";

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

export async function get(id: string) {
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
  const today = new Date(2022, 12, 31);
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
  const today = new Date(2022, 12, 31);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 128);
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
      gigDate: {
        lte: today,
        gte: fiveDaysAgo,
      },
    },
    take: 10,
    orderBy: {
      gigDate: "desc",
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
  // const createdGig = await prisma.gig.create(data);
  // const createdGig = await prisma.gig.create({ data: { id: "abc" } });
  const newRecord = await prisma.gig.create({});
  return newRecord.id;
}

export async function update(
  props: Partial<GigProps> & { client?: { update: Partial<ClientProps> } }
) {
  const gig = await prisma.gig.findFirst({
    where: { id: props.id },
  });

  console.log(props);

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

  if (!gig) {
    throw new Error("Gig not found.");
  }

  const res = await prisma.gig.update({
    data: props,
    where: { id: props.id },
  });

  // console.("actions", data);

  revalidatePath(`/dashboard/gigs/${gig.id}`);

  // return data;
}

export async function getAvailableSantas(gigId: string) {
  const gig = await prisma.gig.findFirst({
    where: { id: gigId },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  const { gigDate, timeStart, timeEnd } = gig;

  const santas = getSantas();

  santas && santas.map((santa) => {});

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
