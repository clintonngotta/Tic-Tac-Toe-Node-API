import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";

import dotenv from "dotenv";

import authRoutes from "./auth/routes";
import playRoutes from "./game/routes";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get("/health", (req: Request, res: Response) => {
	res.status(200).json({
		status: "ok",
		message: "Server is running",
		environment: process.env.NODE_ENV,
		timestamp: new Date().toISOString(),
	});
});

app.use("/auth", authRoutes);
app.use("/play", playRoutes);
const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running @${port}`);
});
