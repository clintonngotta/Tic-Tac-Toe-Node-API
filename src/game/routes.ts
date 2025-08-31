import express from "express";

import {
	GameStatusRequestSchema,
	MakeMoveRequestSchema,
} from "../schemas/game";
import { validateBody } from "../middlewares/validation";
import { play, game_status } from "./controller";

const router = express.Router();

router.post("/", validateBody(MakeMoveRequestSchema), play);
router.post("/game_status", validateBody(GameStatusRequestSchema), game_status);

export default router;
