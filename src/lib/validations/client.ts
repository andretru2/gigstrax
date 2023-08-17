import * as z from "zod";
import { ClientType } from "@prisma/client";

export const clientSchema = z.object({
  id: z.string().min(1, { message: "please select a client" }),
  client: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressStreet: z.string().optional(),
  addressZip: z.string().optional(),
  clientType: z.nativeEnum(ClientType).optional(),
  contact: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  phoneLandline: z.string().optional(),
  phoneCell: z.string().optional(),
  email: z.string().email({ message: "Email invalid" }).optional(),
});
