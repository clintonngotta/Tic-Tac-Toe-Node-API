import bcrypt from "bcrypt";
// import prisma  from "../prisma";
import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { getErrorMessage } from "../lib/errorHandler";
import { loginSchema, signupSchema } from "../schemas/auth";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const login = async (req: Request, res: Response) => {
	try {
		const validatedData = loginSchema.parse(req.body);
		const { email, password } = validatedData;

		const TOKEN_SECRET =
			process.env.TOKEN_SECRET ||
			"jJS5+ugEl4mveLe9knxOvafanG1CvXMQz5z9/yUoS/0DghFUAbHYK4/LiCq2IXfYvyriKhTzeaD6Ov9WQ6966g==";
		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (!existingUser) {
			return res.status(404).json({
				message: `User not found`,
			});
		}

		// check passoword
		const isValidPassword = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isValidPassword) {
			return res.status(401).json({
				message: "Invalid password",
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				userId: existingUser.id,
				email: existingUser.email,
				name: existingUser.name,
			},
			TOKEN_SECRET,
			{
				expiresIn: "1h",
			}
		);
		res.status(200).json({
			message: "Login successful",
			user: {
				user_id: existingUser.id,
				email: existingUser.email,
				name: existingUser.name,
				token,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Error logging in, try again!",
			error: getErrorMessage(error),
		});
	}
};

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
