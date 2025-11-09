import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationToken: String,
		verificationTokenExpires: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{ timestamps: true }
);

userSchema.statics.signup = async function (email, password) {
	if (!email || !password) {
		throw Error("All fields are required");
	}
	if (!validator.isEmail(email)) {
		throw Error("A valid email is required");
	}
	if (!validator.isStrongPassword(password)) {
		throw Error("Password not strong enough");
	}

	const exists = await this.findOne({ email });
	if (exists) {
		throw Error("Email already in use");
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({ email, password: hash });

	return user;
};

userSchema.statics.login = async function (email, password) {
	if (!email || !password) {
		throw Error("All fields are required");
	}

	const user = await this.findOne({ email });
	if (!user) {
		throw Error("Invalid email or password");
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw Error("Invalid email or password");
	}

	if (!user.isVerified) {
		throw Error("Please verify your email before logging in.");
	}

	return user;
};

userSchema.methods.generateEmailVerificationToken = function () {
	const rawToken = crypto.randomBytes(32).toString("hex");
	this.verificationToken = crypto
		.createHash("sha256")
		.update(rawToken)
		.digest("hex");
	this.verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
	return rawToken;
};

userSchema.methods.generatePasswordResetToken = function () {
	const rawToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(rawToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 1000 * 60 * 60; // 1 hour
	return rawToken;
};

userSchema.methods.setPassword = async function (password) {
	if (!validator.isStrongPassword(password)) {
		throw Error("Password not strong enough");
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(password, salt);
};

export default mongoose.model("User", userSchema);
