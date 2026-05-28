import { registerUser, loginUser } from "../backend/controller/user.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;