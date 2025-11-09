import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const APP_NAME = process.env.APP_NAME || "Task App";
const stripTrailingSlash = (url) => url.replace(/\/$/, "");

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);

		const token = createToken(user._id);

		res.status(200).json({ email, token });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const signupUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.signup(email, password);
		const verificationToken = user.generateEmailVerificationToken();
		await user.save();

		const verificationLink = `${stripTrailingSlash(
			FRONTEND_URL
		)}/verify-email?token=${verificationToken}`;
		const message = `
			<p>Hello,</p>
			<p>Thanks for signing up for ${APP_NAME}! Please verify your email address by clicking the link below:</p>
			<p><a href="${verificationLink}">Verify Email</a></p>
			<p>If you did not create this account, you can ignore this email.</p>
		`;

		try {
			await sendEmail({
				to: email,
				subject: `${APP_NAME} - Verify your email`,
				html: message,
				text: `Verify your email: ${verificationLink}`,
			});
		} catch (emailError) {
			console.error("Failed to send verification email", emailError);
			user.verificationToken = undefined;
			user.verificationTokenExpires = undefined;
			await user.save();
			throw new Error(
				"Failed to send verification email. Please try again later."
			);
		}

		res.status(200).json({
			message:
				"Signup successful. Check your email to verify your account.",
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const verifyEmail = async (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res
			.status(400)
			.json({ message: "Verification token is required." });
	}

	try {
		const hashedToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const user = await User.findOne({
			verificationToken: token, //hashedToken
			verificationTokenExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				message: "Verification link is invalid or has expired.",
			});
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpires = undefined;
		await user.save();

		res.status(200).json({ message: "Email verified successfully." });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const requestPasswordReset = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Email is required." });
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(200).json({
				message:
					"If an account exists for that email, a reset link has been sent.",
			});
		}

		const resetToken = user.generatePasswordResetToken();
		await user.save();

		const resetLink = `${stripTrailingSlash(
			FRONTEND_URL
		)}/reset-password?token=${resetToken}`;
		const message = `
			<p>Hello,</p>
			<p>We received a request to reset your ${APP_NAME} password.</p>
			<p><a href="${resetLink}">Reset Password</a></p>
			<p>If you didn't request this, you can safely ignore this email.</p>
		`;

		try {
			await sendEmail({
				to: email,
				subject: `${APP_NAME} - Password reset`,
				html: message,
				text: `Reset your password: ${resetLink}`,
			});
		} catch (emailError) {
			console.error("Failed to send password reset email", emailError);
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save();
			return res.status(500).json({
				message:
					"Unable to send password reset email. Please try again later.",
			});
		}

		res.status(200).json({
			message:
				"If an account exists for that email, a reset link has been sent.",
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const resetPassword = async (req, res) => {
	const { token, password } = req.body;

	if (!token || !password) {
		return res
			.status(400)
			.json({ message: "Reset token and new password are required." });
	}

	try {
		const hashedToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ message: "Reset link is invalid or has expired." });
		}

		await user.setPassword(password);
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		res.status(200).json({
			message: "Password reset successfully. You can now log in.",
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export default {
	loginUser,
	signupUser,
	verifyEmail,
	requestPasswordReset,
	resetPassword,
};
