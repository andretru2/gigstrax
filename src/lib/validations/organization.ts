import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  trialStartDate: z.date().optional(),
  trialEndDate: z.date().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
});

export const createOrganizationSchema = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateOrganizationSchema = createOrganizationSchema.partial();

export type OrganizationProps = z.infer<typeof organizationSchema>;
export type CreateOrganizationProps = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationProps = z.infer<typeof updateOrganizationSchema>;
