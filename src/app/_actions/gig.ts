"use server";

import { prisma, type GigProps } from "@/server/db";
import { type z } from "zod";
import { type gigSchema } from "@/lib/validations/gig";
import { revalidatePath } from "next/cache";

// import * as z from "zod";

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
          role: true,
        },
      },
      mrsSanta: {
        select: {
          nameFirst: true,
        },
      },
      price: true,
      amountPaid: true,
      santaId: true,

      venueAddressCity: true,
      venueAddressName: true,
      venueAddressState: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,
      venueAddressZip: true,

      client: {
        select: {
          client: true,
          addressCity: true,
          addressState: true,
          addressStreet: true,
          addressZip: true,
          clientType: true,
          contact: true,
        },
      },
    },
    where: {
      id: id,
    },
  });

  return data;
}

export async function getUpcoming() {
  const today = new Date(2022, 12, 31);
  return await prisma.gig.findMany({
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
}

export async function getRecentlyCreated() {
  const today = new Date(2022, 12, 31);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 128);
  return await prisma.gig.findMany({
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
        gte: fiveDaysAgo,
      },
    },
    take: 25,
    orderBy: {
      gigDate: "desc",
    },
  });
}

export async function getPast() {
  const today = new Date(2022, 12, 31);
  console.log("today", today);
  return await prisma.gig.findMany({
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
    take: 25,
  });
}
export async function create(input?: GigProps) {
  let data = {};
  if (input) {
    data = { data: input };
  }
  const createdGig = await prisma.gig.create(data);
  return createdGig.id;
}

export async function update(props: Partial<GigProps>) {
  if (props.timeStart) {
    props.timeStart.setSeconds(0);
    props.timeStart.setMilliseconds(0);
  }

  if (props.timeEnd) {
    props.timeEnd.setSeconds(0);
    props.timeEnd.setMilliseconds(0);
  }

  const gig = await prisma.gig.findFirst({
    where: { id: props.id },
  });

  if (!gig) {
    throw new Error("Product not found.");
  }

  await prisma.gig.update({
    data: props,
    where: { id: props.id },
  });

  // console.log("actions", data);

  revalidatePath(`/dashboard/gigs/${gig.id}`);

  // return data;
}
