import type { Request, Response } from "express";

import { getErrorMessage } from "../lib/errorHandler";
const GAME_BASE_URL = process.env.GAME_URL || "http://localhost:8000";

export const play = async (req: Request, res: Response) => {
	try {
		const game_req = await fetch(`${GAME_BASE_URL}/play`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(req.body),
		});

		if (!game_req.ok) {
			res.status(500).json({
				message: "error playing game",
			});
		}

		const data = await game_req.json();
		res.status(200).json(data);
	} catch (error) {
		console.log("error:", error);
		console.log("body:", req.body);

		res.status(500).json({
			message: "Error playing the game!",
			error: getErrorMessage(error),
		});
	}
};

export const game_status = async (req: Request, res: Response) => {
	try {
		const game_req = await fetch(`${GAME_BASE_URL}/game_status`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(req.body),
		});

		if (!game_req.ok) {
			res.status(500).json({
				message: "error playing game",
			});
		}

		const data = await game_req.json();
		res.status(200).json(data);
	} catch (error) {
		console.log("error:", error);
		console.log("body:", req.body);

		res.status(500).json({
			message: "Error checking the game status!",
			error: getErrorMessage(error),
		});
	}
};
