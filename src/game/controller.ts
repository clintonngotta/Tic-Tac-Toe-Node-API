import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

import { getErrorMessage } from "../lib/errorHandler";
import { DecodedToken, RequestWithToken } from "../middlewares/verify_token";
const GAME_BASE_URL = process.env.GAME_URL || "http://localhost:8000";
const prisma = new PrismaClient();

export const play = async (req: RequestWithToken, res: Response) => {
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
		await record_user_stats(data, req.user);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({
			message: "Error playing the game!",
			error: getErrorMessage(error),
		});
	}
};

interface GameStatsInterface {
	is_game_over: string;
	winner: number; // X is -1, and O is 1
	is_draw: boolean;
	status: string;
}

const record_user_stats = async (
	data: GameStatsInterface,
	user: DecodedToken
) => {
	const userId = user.userId;
	let userData = {
		userId: userId,
		wins: 0,
		losses: 0,
		draws: 0,
	};
	if (data.is_game_over) {
		if (data.winner == -1) {
			userData.wins = 1;
		} else if (data.winner == 1) {
			userData.losses = 1;
		} else {
			userData.draws = 1;
		}
	}

	return await prisma.gameStats.upsert({
		where: {
			userId,
		},
		update: {
			userId,
			wins:
				userData.wins == 1
					? {
							increment: 1,
					  }
					: undefined,
			losses:
				userData.losses == 1
					? {
							increment: 1,
					  }
					: undefined,
			draws:
				userData.draws == 1
					? {
							increment: 1,
					  }
					: undefined,
		},
		create: {
			userId,
			wins: userData.wins,
			losses: userData.losses,
			draws: userData.draws,
		},
	});
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
		res.status(500).json({
			message: "Error checking the game status!",
			error: getErrorMessage(error),
		});
	}
};

export const game_stats = async (req: RequestWithToken, res: Response) => {
	try {
		const { userId } = req.user;
		const stats = await prisma.gameStats.findMany({
			where: {
				userId,
			},
		});
		res.status(200).json({
			message: "user stats fetched successully",
			data: stats,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching stats", error: getErrorMessage(error) });
	}
};
