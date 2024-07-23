import { GlobalRole } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  role: z.nativeEnum(GlobalRole).default(GlobalRole.CUSTOMER),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateUserSchema = createUserSchema.partial();

export type UserProps = z.infer<typeof userSchema>;
export type CreateUserProps = z.infer<typeof createUserSchema>;
export type UpdateUserProps = z.infer<typeof updateUserSchema>;
