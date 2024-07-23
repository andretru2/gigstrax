import { z } from "zod";
import { MembershipRole } from "@prisma/client";

export const membershipSchema = z.object({
  id: z.string().cuid().optional(),
  role: z.nativeEnum(MembershipRole).default(MembershipRole.OWNER),
  orgId: z.string().cuid(),
  userId: z.string().cuid().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
});

export const createMembershipSchema = membershipSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateMembershipSchema = createMembershipSchema.partial();

export type MembershipProps = z.infer<typeof membershipSchema>;
export type CreateMembershipProps = z.infer<typeof createMembershipSchema>;
export type UpdateMembershipProps = z.infer<typeof updateMembershipSchema>;
