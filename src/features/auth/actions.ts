"use server";

import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { registerSchema, type RegisterInput } from "./schema";

export async function registerUser(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password, gender, dateOfBirth } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      gender,
      dateOfBirth: new Date(dateOfBirth),
    },
  });

  return { success: true, userId: user.id };
}
