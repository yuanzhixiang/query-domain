import * as z from "zod";

export const siteSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Invalid domain format"
    ),
});

export const updateSiteNameSchema = z.object({
  name: z.string().optional(),
});

export type SiteFormData = z.infer<typeof siteSchema>;
export type UpdateSiteNameData = z.infer<typeof updateSiteNameSchema>;
