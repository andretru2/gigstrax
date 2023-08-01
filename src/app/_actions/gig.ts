"use server";

import { prisma, type GigProps } from "@/server/db";

import type * as z from "zod";

// type GigProps = typeof prisma["gig"]

export async function getUpcoming() {
  const today = new Date(2022, 12, 31);
  return await prisma.gig.findMany({
    select: {
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      client: {
        select: {
          client: true,
        },
      },
      santa: {
        select: {
          nameFirst: true,
          nameLast: true,
        },
      },
    },
    where: {
      gigDate: { gte: today },
    },
    take: 25,
  });
}

export async function getRecentlyCreated() {
  const today = new Date(2022, 12, 31);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 128);
  console.log("today", today, fiveDaysAgo);
  return await prisma.gig.findMany({
    where: {
      gigDate: {
        lte: today,
        gte: fiveDaysAgo,
      },
    },
    take: 25,
  });
}

export async function getPast() {
  const today = new Date(2022, 12, 31);
  console.log("today", today);
  return await prisma.gig.findMany({
    where: {
      gigDate: {
        lte: today,
      },
    },
    take: 25,
  });
}

export async function create(input: GigProps) {
  const res = await prisma.gig.create({ data: input });
}
