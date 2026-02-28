import express from "express";
import { rateCode } from "../controllers/rateCode.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const rateCodeRoutes = express.Router();

rateCodeRoutes.post("/", authMiddleware, rateCode);

export default rateCodeRoutes;
