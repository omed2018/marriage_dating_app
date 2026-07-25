import { z } from "zod";

export const reportSchema = z.object({
  reportedId: z.string(),
  reason: z.enum([
    "FAKE_PROFILE",
    "INAPPROPRIATE_CONTENT",
    "HARASSMENT",
    "SPAM",
    "OTHER",
  ]),
  description: z.string().max(500).optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
