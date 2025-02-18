import { Router } from "express";
const authRoutes = Router();


import { registerHandler } from "../controllers/auth.controller.js";
import { loginHandler } from "../controllers/auth.controller.js";
import { logoutHandler } from "../controllers/auth.controller.js";
import { refreshHandler } from "../controllers/auth.controller.js";
import { verifyEmailHandler } from "../controllers/auth.controller.js";
authRoutes.post("/register",registerHandler);
authRoutes.post("/login",loginHandler);
authRoutes.get("/logout",logoutHandler);
authRoutes.get("/refresh",refreshHandler);
authRoutes.get("/email/verify/:code",verifyEmailHandler);

export default authRoutes;

