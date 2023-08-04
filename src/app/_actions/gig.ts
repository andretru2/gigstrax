"use server";

import { prisma, type GigProps } from "@/server/db";

import type * as z from "zod";

// type GigProps = typeof prisma["gig"]

export async function getUpcoming(): Promise<GigProps[]> {
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
          role: true,
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
          role: true,
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

export async function create(input: GigProps) {
  const res = await prisma.gig.create({ data: input });
}
