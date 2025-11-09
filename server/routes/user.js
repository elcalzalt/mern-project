import express from "express";
import userController from "../controllers/userController.js";

const {
	loginUser,
	signupUser,
	verifyEmail,
	requestPasswordReset,
	resetPassword,
} = userController;

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.post("/verify-email", verifyEmail);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

export default router;
