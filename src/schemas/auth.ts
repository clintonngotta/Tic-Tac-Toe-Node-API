import { z } from "zod";

export const signupSchema = z.object({
	password: z.string().min(5, "Password must be at least 5 characters"),
	email: z.email("Invalid email format"),
	name: z.string().min(5),
});

export const loginSchema = z.object({
	email: z.email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});
