import { z, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateBody = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);			
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: "Validation failed",
					errors: error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				});
			}
			next(error);
		}
	};
};
