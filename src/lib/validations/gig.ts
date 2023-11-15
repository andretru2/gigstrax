import { type GigProps } from "@/server/db";
import * as z from "zod";
import { isValidDate, isValidTime, isValidPrice } from "../utils";
import { clientSchema } from "./client";
import { VenueType } from "@prisma/client";

const timeSchema = z.string().refine(isValidTime, {
  message: "Must be a valid date",
});
const priceSchema = z.string().refine(isValidPrice, {
  message: "Price must be a number",
});

export const gigSchema = z
  .object({
    gigDate: z.date().refine(
      (date) => {
        if (!isValidDate(date)) {
          return false;
        }
        return true;
      },
      {
        message: "Must be a valid date",
      }
    ),
    timeStart: timeSchema,
    timeEnd: timeSchema,
    venueAddressCity: z.string().min(1, { message: "City is required" }),
    venueAddressName: z.string().min(1, { message: "Venue is required" }),
    venueAddressState: z.string().min(1, { message: "State is required" }),
    venueAddressStreet: z.string().min(1, { message: "Street is required" }),
    venueAddressStreet2: z.string().optional(),
    venueAddressZip: z.string(),
    clientId: z.string().min(1, { message: "Client is required" }),
    santaId: z.string().min(1, { message: "Santa is required" }),
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
    amountPaid: priceSchema,
    price: priceSchema,
    serial: z.number().optional(),
    travelType: z.string().optional(),
    venueType: z.nativeEnum(VenueType).optional(),
    isSoftHold: z.boolean().optional(),
    createdAt: z.date().optional(),
    createdBy: z.string().optional(),
    updatedAt: z.date().optional(),
    updatedBy: z.string().optional(),
    santa: z.object({
      id: z.string().optional(),
      role: z.string().optional(),
    }),
    mrsSanta: z.object({
      id: z.string().optional(),
      role: z.string().optional(),
    }),
    // client: z.object({ update: clientSchema }),
    client: clientSchema,
  })
  .refine(
    (data) => {
      return data.timeStart <= data.timeEnd;
    },
    {
      message: "Start time must be before end time",
    }
  );
//satisfies z.ZodType<GigProps>;

// export const gigMultiEventSchema = gigSchema.pick({
//   gigDate: true,
//   timeStart: true,
//   timeEnd: true,
// });

// type gigMultiEventSchema = z.infer<typeof gigMultiEventSchema>;

export const gigMultiEventSchema = z.object({
  gigDate: z.date().refine(
    (date) => {
      if (!isValidDate(date)) {
        return false;
      }
      return true;
    },
    {
      message: "Must be a valid date",
    }
  ),
  timeStart: timeSchema,
  timeEnd: timeSchema,
});
