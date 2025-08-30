import express from "express";
import { login, signup } from "./controller";
import { loginSchema, signupSchema } from "../schemas/auth";
import { validateBody } from "../middlewares/validation";

const router = express.Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/signup", validateBody(signupSchema), signup);

export default router;
