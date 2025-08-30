import bcrypt from "bcrypt";
// import prisma  from "../prisma";
import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { getErrorMessage } from "../lib/errorHandler";
import { signupSchema } from "../schemas/auth";
const prisma = new PrismaClient();
export const login = (req: Request, res: Response) => {};

export const signup = async (req: Request, res: Response) => {
	try {
		const validatedData = signupSchema.parse(req.body);
		const { email, name, password } = validatedData;

		const hashedPassword = await bcrypt.hash(password, 10);

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(409).json({
				message: `email already taken`,
			});
		}

		await prisma.user.upsert({
			where: { email },
			update: {
				name,
				password: hashedPassword,
			},
			create: {
				email,
				name,
				password: hashedPassword,
			},
		});

		res.status(201).json({
			message: "user created successfully",
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error signing up", error: getErrorMessage(error) });
	}
};
