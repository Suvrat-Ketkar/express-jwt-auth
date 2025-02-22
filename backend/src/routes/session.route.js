import { Router } from "express";
import { getSessionsHandler } from "../controllers/session.controller.js";
import { deleteSessionHandler } from "../controllers/session.controller.js";
const sessionRoutes = Router();

sessionRoutes.get("/",getSessionsHandler);
sessionRoutes.delete("/:id",deleteSessionHandler);
export default sessionRoutes;