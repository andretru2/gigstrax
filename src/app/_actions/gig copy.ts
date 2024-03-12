"use server";

import { prisma, type GigProps, type ClientProps } from "@/server/db";

import { revalidatePath } from "next/cache";
import { addHours, subHours } from "@/lib/utils";
import { getSources } from "./source";
import { type Prisma, type Gig } from "@prisma/client";
import {
  type SantaProps,
  type GetGigsProps,
  type GigExtendedProps,
  type SantaType,
} from "@/types/index";
import { redirect } from "next/navigation";
import { getClient } from "./client";

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

  // console.log(
  //   "time start from utcx",
  //   data?.timeStart,
  //   data?.timeStart?.toLocaleString(),
  //   fromUTC(data?.timeStart),
  //   fromUTC(data?.timeEnd),
  //   fromUTC(data?.gigDate),
  //   data?.timeStart?.toISOString().slice(11, 16),
  //   fromUTC(data?.timeStart?.toTimeString().slice(0, 5)),
  //   fromUTC(data?.timeStart?.toTimeString().slice(11, 16))
  // );

  // if (data?.gigDate) {
  //   const localGigDate = fromUTC(data.gigDate);
  //   data.gigDate = localGigDate;
  // }

  // if (data?.timeStart) {
  //   const newTime = fromUTC(data?.timeStart);
  //   data.timeStart = newTime;
  // }

  // if (data?.timeEnd) {
  //   const newTime = fromUTC(data?.timeEnd);
  //   data.timeEnd = newTime;
  // }

  return data;
}

export async function getGigs({
  select = { id: true },
  whereClause = {},
  orderBy = [],
  limit = 10,
  skip = 0,
}: // distinct = [],
GetGigsProps) {
  const totalCount = await prisma.gig.count({ where: whereClause });

  const data = await prisma.gig.findMany({
    select: select,
    where: whereClause,
    orderBy: orderBy,
    take: limit,
    skip: skip,
  });

  return {
    // data: data.map(mapGig),
    data: data,
    totalCount,
  };
}

function mapGig(gig: GigProps) {
  // if (gig.gigDate) {
  //   const localGigDate = fromUTC(gig.gigDate);
  //   gig.gigDate = localGigDate;
  // }
  // if (gig.createdAt) {
  //   const localCreatedAt = fromUTC(gig.createdAt);
  //   gig.createdAt = localCreatedAt;
  // }

  // if (gig?.timeStart) {
  //   const newTime = fromUTC(gig?.timeStart);
  //   gig.timeStart = newTime;
  // }

  // if (gig?.timeEnd) {
  //   const newTime = fromUTC(gig?.timeEnd);
  //   gig.timeEnd = newTime;
  // }

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
  props: Partial<GigProps> & { client?: { update: Partial<ClientProps> } },
) {
  // console.log(props);
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
  const res = await prisma.gig.update({
    data: data,
    where: { id: props.id },
    include: include ? include : undefined,
  });
  // console.log(res);

  props.id && revalidatePath(`/dashboard/gigs/${props.id}`);
  revalidatePath(`/dashboard/gigs/`);
  // props.id && redirect(`/dashboard/gigs/${props.id}`);
  // console.log("here", res);

  return res;
}

export async function getSantasByAvailabilityx(id: string) {
  const gig = await prisma.gig.findFirst({
    select: {
      gigDate: true,
      timeStart: true,
      timeEnd: true,
    },
    where: { id: id },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  const { gigDate, timeStart, timeEnd } = gig;

  if (!gigDate || !timeStart || !timeEnd) {
    return { available: [], unavailable: [] };
  }

  const dateStart = new Date(gigDate.getTime());
  dateStart.setHours(timeStart.getHours(), timeStart.getMinutes());

  const dateEnd = new Date(gigDate.getTime());
  dateEnd.setHours(timeEnd.getHours(), timeEnd.getMinutes());

  const { data: santas } = await getSources({
    select: {
      id: true,
      role: true,
    },
    whereClause: {
      status: "Active",
      role: {
        contains: "RBS",
      },
    },
    limit: 100,
  });

  const santaIds = santas.map((santa) => santa.id);

  const { data: unavailableSantaIds } = await getGigs({
    select: {
      id: true,
      santaId: true,
    },
    whereClause: {
      gigDate: gigDate,
      OR: [
        { timeStart: { lte: subHours(dateStart, 4) } },
        { timeEnd: { gte: addHours(dateEnd, 4) } },
        { timeStart: { equals: dateStart } },
        { timeEnd: { equals: dateEnd } },
      ],
      santaId: { not: null },
      id: { not: id },
    },
  });

  const unavailableIds = [
    ...new Set(
      unavailableSantaIds.map((unavailableSanta) => unavailableSanta.santaId),
    ),
  ];

  const availableIds = santaIds.filter(
    (santa) => !unavailableIds.includes(santa),
  );
  // console.log(santas, availableIds, unavailableIds);

  const available = santas
    .filter((santa) => availableIds.includes(santa.id))
    .sort((a, b) => a.role.localeCompare(b.role));
  const unavailable = santas
    .filter((santa) => unavailableIds.includes(santa.id))
    .sort((a, b) => a.role.localeCompare(b.role));

  return { available, unavailable };
}

export async function getSantasByAvailability(id: string, role: SantaType) {
  const gig = await prisma.gig.findFirst({
    select: {
      gigDate: true,
      timeStart: true,
      timeEnd: true,
    },
    where: { id: id },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  const { gigDate, timeStart, timeEnd } = gig;

  if (!gigDate || !timeStart || !timeEnd) {
    return { available: [], unavailable: [] };
  }

  const dateStart = new Date(gigDate.getTime());
  dateStart.setHours(timeStart.getHours(), timeStart.getMinutes());

  const dateEnd = new Date(gigDate.getTime());
  dateEnd.setHours(timeEnd.getHours(), timeEnd.getMinutes());

  const { data: santas } = await getSources({
    select: {
      id: true,
      role: true,
    },
    whereClause: {
      status: "Active",
      role: {
        contains: role,
      },
    },
    limit: 100,
  });

  const santaIds = santas.map((santa) => santa.id);

  const santaIdKey = role === "RBS" ? "santaId" : "mrsSantaId";

  const { data: unavailableSantaIds } = await getGigs({
    select: {
      id: true,
      [santaIdKey]: true,
    },
    whereClause: {
      gigDate: gigDate,
      OR: [
        { timeStart: { lte: subHours(dateStart, 4) } },
        { timeEnd: { gte: addHours(dateEnd, 4) } },
        { timeStart: { equals: dateStart } },
        { timeEnd: { equals: dateEnd } },
      ],
      [santaIdKey]: { not: null },
      id: { not: id },
    },
  });

  const unavailableIds = [
    ...new Set(
      unavailableSantaIds.map((unavailableSanta) => unavailableSanta.santaId),
    ),
  ];

  const availableIds = santaIds.filter(
    (santa) => !unavailableIds.includes(santa),
  );
  // console.log(santas, availableIds, unavailableIds);

  const available = santas
    .filter((santa) => availableIds.includes(santa.id))
    .sort((a, b) => a.role.localeCompare(b.role));
  const unavailable = santas
    .filter((santa) => unavailableIds.includes(santa.id))
    .sort((a, b) => a.role.localeCompare(b.role));

  return { available, unavailable };
}

export async function copyFromClient(id: string) {
  const gig = await prisma.gig.findFirst({
    where: { id: id },
  });

  if (!gig?.clientId) {
    throw new Error("Gig not found.");
  }

  const client = await getClient(gig.clientId);

  if (!client) {
    throw new Error("Client not found.");
  }

  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    clientType,
    contact,
    source,
    phoneCell,
    phoneLandline,
    email,
    notes,
  } = client;

  return update({
    id: id,
    venueAddressCity: addressCity,
    venueAddressState: addressState,
    venueAddressStreet: addressStreet,
    venueAddressZip: addressZip,
    contactName: contact,
    contactPhoneCell: phoneCell,
    contactPhoneLand: phoneLandline,
    contactEmail: email,
    notesVenue: notes,
  });
}

// export async function multiEventCreate({
//   idCopyFrom,
//   formData,
// }: {
//   idCopyFrom: string;
//   formData: FormData<GigProps>[];
// }) {
//   if (!formData || !idCopyFrom) return null;

//   const gig = await prisma.gig.findFirst({
//     where: { id: idCopyFrom },
//   });

//   if (!gig) {
//     throw new Error("Gig not found.");
//   }

//   const {
//     gigDate,
//     timeStart,
//     timeEnd,
//     venueAddressCity,
//     venueAddressName,
//     venueAddressState,
//     venueAddressStreet,
//     venueAddressStreet2,
//     venueAddressZip,
//     venueType,
//     contactName,
//     contactEmail,
//     contactPhoneCell,
//     contactPhoneLand,
//     notesVenue,
//     clientId,
//     santaId,
//     mrsSantaId,
//     price,
//     amountPaid,
//     isSoftHold,
//     driverId,
//     notesGig,
//     travelType,
//   } = gig;

//   // Create an array to store new gig objects
//   const newGigs = [];

//   // Iterate through the formData array
//   formData.forEach((form) => {
//     const newGig = {
//       timeStart: form.timeStart || timeStart,
//       timeEnd: form.timeEnd || timeEnd,
//       gigDate: form.gigDate || gigDate,
//       venueAddressCity: form.venueAddressCity || venueAddressCity,
//       venueAddressName: form.venueAddressName || venueAddressName,
//       venueAddressState: form.venueAddressState || venueAddressState,
//       venueAddressStreet: form.venueAddressStreet || venueAddressStreet,
//       venueAddressStreet2: form.venueAddressStreet2 || venueAddressStreet2,
//       venueAddressZip: form.venueAddressZip || venueAddressZip,
//       venueType: form.venueType || venueType,
//       contactName: form.contactName || contactName,
//       contactEmail: form.contactEmail || contactEmail,
//       contactPhoneCell: form.contactPhoneCell || contactPhoneCell,
//       contactPhoneLand: form.contactPhoneLand || contactPhoneLand,
//       notesVenue: form.notesVenue || notesVenue,
//       clientId: form.clientId || clientId,
//       santaId: form.santaId || santaId,
//       mrsSantaId: form.mrsSantaId || mrsSantaId,
//       price: form.price || price,
//       amountPaid: form.amountPaid || amountPaid,
//       isSoftHold: form.isSoftHold || isSoftHold,
//       driverId: form.driverId || driverId,
//       notesGig: form.notesGig || notesGig,
//       travelType: form.travelType || travelType,
//     };

//     newGigs.push(newGig);
//   });

//   // // Create all new gigs in a single database call
//   // await prisma.gig.createMany({
//   //   data: newGigs,
//   // });

//   // return newGigs; // Optionally, return the created gigs
// }

// Cache santas
// let santasCache;

// async function getSantas() {
//   if (!santasCache) {
//     santasCache = await getSources({
//       // only select necessary fields
//     });
//   }

//   return santasCache;
// }

// export async function getAvailableSantas(id) {

//   // Get gig
//   const gig = await prisma.gig.findFirst({
//     where: { id },
//     select: { // limit fields
//       santaId: true,
//       timeStart: true,
//       timeEnd: true
//     }
//   });

//   // Get santa ids
//   const santaIds = await getSantas().then(santas => santas.map(s => s.id));

//   // Get unavailable santa ids
//   const unavailableSantaIds = await getGigs({
//     where: {
//       santaId: { in: santaIds },
//       OR: [
//         { timeStart: { lte: subHours(gig.timeStart, 4) } },
//         { timeEnd: { gte: addHours(gig.timeEnd, 4) } }
//       ]
//     }
//   }).then(gigs => gigs.map(g => g.santaId));

//   // Filter available
//   const availableSantas = await Promise.all(santaIds.map(async santaId => {
//     return {
//       id: santaId,
//       unavailable: unavailableSantaIds.includes(santaId)
//     };
//   })).then(santas => santas.filter(s => !s.unavailable));

//   // Map to santa data
//   const available = await Promise.all(availableSantas.map(async santa => {
//     return getSantas().then(santas => santas.find(s => s.id === santa.id));
//   }));

//   return available;

// }
