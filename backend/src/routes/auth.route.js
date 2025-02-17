import { Router } from "express";
const authRoutes = Router();


import { registerHandler } from "../controllers/auth.controller.js";
import { loginHandler } from "../controllers/auth.controller.js";
import { logoutHandler } from "../controllers/auth.controller.js";
authRoutes.post("/register",registerHandler);
authRoutes.post("/login",loginHandler);
authRoutes.get("/logout",logoutHandler);

export default authRoutes;

