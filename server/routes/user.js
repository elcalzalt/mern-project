import express from "express";
import userController from "../controllers/userController.js";

const { loginUser, signupUser } = userController;

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

export default router;
