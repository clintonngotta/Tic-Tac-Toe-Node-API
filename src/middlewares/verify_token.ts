import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface DecodedToken {
	userId: string;
	email: string;
	name: string;
	iat: number;
	exp: number;
}

export interface RequestWithToken extends Request {
	user: {
		userId: string;
		email: string;
		name: string;
		iat: number;
		exp: number;
	};
}

export const validateToken = (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	} else {
		const token = bearerHeader.split(" ")[1];

		try {
			const decoded = jwt.verify(
				token,
				process.env.TOKEN_SECRET as string
			) as DecodedToken;
			req.user = decoded;
			next();
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				return res.status(403).json({ message: "Token expired." });
			}
			return res.status(403).json({ message: "Invalid token." });
		}
	}
};
