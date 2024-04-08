import * as z from "zod";
import { isValidTime, isValidPrice } from "../utils";
import { VenueType } from "@prisma/client";

const timeSchema = z.string().refine(isValidTime, {
  message: "Must be a valid date",
});
const priceSchema = z.string().refine(isValidPrice, {
  message: "Price must be a number",
});

// const dateTimeSchema = z
//   .string()
//   .datetime({ offset: true })
//   .pipe(z.coerce.date())
//   .optional();

export const gigSchema = z.object({
  // gigDate: dateTimeSchema,
  gigDate: z.any().optional(),
  timeStart: z.any().optional(),
  timeEnd: z.any().optional(),
  // timeStart: timeSchema.optional(),
  // timeEnd: timeSchema.optional(),
  venueAddressCity: z
    .string()
    .min(1, { message: "City is required" })
    .optional(),
  venueAddressName: z
    .string()
    .min(1, { message: "Venue is required" })
    .optional(),
  venueAddressState: z
    .string()
    .min(1, { message: "State is required" })
    .optional(),
  venueAddressStreet: z
    .string()
    .min(1, { message: "Street is required" })
    .optional(),
  venueAddressStreet2: z.string().optional(),
  venueAddressZip: z.string().optional(),
  clientId: z.string().min(1, { message: "Client is required" }).optional(),
  santaId: z.string().min(1, { message: "Santa is required" }).optional(),
  mrsSantaId: z.string().optional(),
  calendarId: z.string().optional(),
  driverId: z.string().optional(),
  contactEmail: z
    .string()
    .email({ message: "Please enter a valid Email." })
    .optional(),
  contactName: z.string().optional(),
  contactPhoneCell: z.string().optional(),
  contactPhoneLand: z.string().optional(),
  invoiceNumber: z.string().optional(),
  notesGig: z.string().optional(),
  notesVenue: z.string().optional(),
  amountPaid: priceSchema.optional(),
  // price: priceSchema.optional(),
  price: z.coerce.number().positive().optional(),
  serial: z.number().optional(),
  travelType: z.string().optional(),
  venueType: z.nativeEnum(VenueType).optional(),
  isSoftHold: z.boolean().optional(),
  createdAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
  // santa: z
  //   .object({
  //     id: z.string().optional(),
  //     role: z.string().optional(),
  //   })
  //   .optional(),
  // mrsSanta: z
  //   .object({
  //     id: z.string().optional(),
  //     role: z.string().optional(),
  //   })
  //   .optional(),
  // client: z.object({ update: clientSchema }),
  // client: clientSchema.optional(),
});
// .refine(
//   (data) => {
//     if (data.timeStart && data.timeEnd) return data.timeStart <= data.timeEnd;
//   },
//   {
//     message: "Start time must be before end time",
//   },
// );
//satisfies z.ZodType<Gig>;

// export const gigMultiEventSchema = gigSchema.pick({
//   gigDate: true,
//   timeStart: true,
//   timeEnd: true,
// });

// type gigMultiEventSchema = z.infer<typeof gigMultiEventSchema>;

export const gigMultiEventSchema = z.object({
  // gigDate: z.date().refine(
  //   (date) => {
  //     if (!isValidDate(date)) {
  //       return false;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "Must be a valid date",
  //   },
  // ),
  gigDate: z.any(),
  timeStart: timeSchema,
  timeEnd: timeSchema,
});
