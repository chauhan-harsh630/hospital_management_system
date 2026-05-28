import { createDoctorProfile, getDoctorProfile } from "../backend/controller/doctor.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.js";


const router = express.Router();
router.post("/create-profile", authMiddleware, createDoctorProfile);
router.get("/profile", authMiddleware, getDoctorProfile);
export default router;