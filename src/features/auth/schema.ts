import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Please select your gender",
  }),
  dateOfBirth: z.string().refine((val) => {
    const age = Math.floor(
      (Date.now() - new Date(val).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return age >= 18;
  }, "You must be at least 18 years old"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
