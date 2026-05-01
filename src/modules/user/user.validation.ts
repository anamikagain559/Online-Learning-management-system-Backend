import z from "zod";
import { Role, IsActive } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().min(5).max(100),
  password: z.string().min(8)
    .regex(/^(?=.*[A-Z])/, "Must contain uppercase")
    .regex(/^(?=.*[!@#$%^&*])/, "Must contain special char")
    .regex(/^(?=.*\d)/, "Must contain number"),
  phone: z.string().optional(),
  address: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
  travelInterests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
  currentLocation: z.string().optional(),
  picture: z.string().optional(), 
  role: z.enum(Object.values(Role) as [string]).optional(),
});

export const updateUserZodSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    password: z.string().min(8)
        .regex(/^(?=.*[A-Z])/, "Must contain uppercase")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain special char")
        .regex(/^(?=.*\d)/, "Must contain number")
        .optional(),
    phone: z.string().optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    address: z.string().max(200).optional(),
    bio: z.string().max(500).optional(),
    travelInterests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
    picture: z.string().url().optional(), // ✅ new field added
});
