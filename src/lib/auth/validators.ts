import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
  referralCode: z.string().trim().min(3).max(64).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});



