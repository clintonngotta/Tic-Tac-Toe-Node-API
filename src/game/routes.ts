import express from "express";

import {
	GameStatusRequestSchema,
	MakeMoveRequestSchema,
} from "../schemas/game";
import { validateBody } from "../middlewares/validation";
import { play, game_status, game_stats } from "./controller";

const router = express.Router();

router.post("/play", validateBody(MakeMoveRequestSchema), play);
router.post("/status", validateBody(GameStatusRequestSchema), game_status);
router.get("/stats", game_stats);

export default router;
