import { Router } from "express";
const authRoutes = Router();

import { registerHandler } from "../controllers/auth.controller.js";

authRoutes.post("/register",registerHandler);

export default authRoutes;