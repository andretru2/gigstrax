import {
  PrismaClient,
  type Gig,
  type Client,
  type Source,
  type VenueType,
} from "@prisma/client";
import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

//   export const prisma =
// globalForPrisma.prisma ??
// new PrismaClient({
//   log:
//     env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
// })
//   .$extends({
//     result: {
//       source: {
//         fullName: {
//           needs: { nameFirst: true, nameLast: true },
//           compute(source) {
//             return `${source.nameFirst} ${source.nameLast}`;
//           },
//         },
//       },
//     },
//   })
//   .$extends({
//     result: {
//       gig: {
//         fullAddress: {
//           needs: {
//             venueAddressCity: true,
//             venueAddressState: true,
//             venueAddressName: true,
//             venueAddressZip: true,
//             venueAddressStreet: true,
//             venueType: true,
//           },
//           compute(gig) {
//             return `${gig.venueAddressName} | ${gig.venueAddressStreet} | ${
//               gig.venueAddressCity
//             } | ${gig.venueAddressState} | ${gig.venueAddressZip ?? ""}`;
//           },
//         },
//       },
//     },
//   })
//   .$extends({
//     result: {
//       client: {
//         fullAddress: {
//           needs: {
//             addressState: true,
//             addressZip: true,
//             addressStreet: true,
//             addressCity: true,
//           },
//           compute(client) {
//             return `${client.addressStreet ?? ""} | ${
//               client.addressCity ?? ""
//             } | ${client.addressState} | ${client.addressZip ?? ""}`;
//           },
//         },
//       },
//     },
//   });
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type GigProps = Gig;
export type ClientProps = Client;
export type SourceProps = Source;
