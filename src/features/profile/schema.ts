import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  height: z.number().int().min(100).max(250).optional(),
  religion: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
