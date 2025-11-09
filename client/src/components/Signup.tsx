import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "../config";
const signUpSchema = z.object({
	firstname: z.string().min(1, "At least 1 character for firstname"),
	lastname: z.string().min(1, "At least 1 character for lastname"),
	//username: z.string().min(3, "At least 3 character for username"),
	email: z.email("Please enter valid email"),
	password: z
		.string()
		.min(8, "Enter a valild password")
		.regex(/[a-z]/, "At least one lowercase letter")
		.regex(/[A-Z]/, "At least one uppercase letter")
		.regex(/[0-9]/, "At least one number")
		.regex(/[^A-Za-z0-9]/, "At least one special character"),
});
type SignUpFormValues = z.infer<typeof signUpSchema>;
export const Signup = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
	});
	const [showRequirements, setShowRequirements] = useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};
	const onSubmit = async (data: SignUpFormValues) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// Only send email and password for now
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				alert("Sign up successful! You can now log in.");
				// Optionally redirect to login page
			} else {
				alert(result.message || "Signup failed");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Server error");
		}
	};

	return (
		<>
			<form
				className="signupWrap"
				id="signup"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="welcome">Welcome!</h2>
				<TextField
					sx={{ mt: 2 }} // mt = margin-top, uses theme spacing (2 = 16px)
					id="outlined-basic"
					label="First Name"
					variant="outlined"
					fullWidth
					{...register("firstname")}
				/>
				{errors.firstname && (
					<p className="signupError marginP">
						{" "}
						{errors.firstname.message}
					</p>
				)}
				<TextField
					sx={{ mt: 2 }}
					id="outlined-basic"
					label="Last Name"
					variant="outlined"
					fullWidth
					{...register("lastname")}
				/>
				{errors.lastname && (
					<p className="signupError marginP">
						{" "}
						{errors.lastname.message}
					</p>
				)}
				<TextField
					sx={{ mt: 2 }}
					id="outlined-basic"
					label="Email"
					variant="outlined"
					fullWidth
					{...register("email")}
				/>
				{errors.email && (
					<p className="signupError marginP">
						{" "}
						{errors.email.message}
					</p>
				)}
				<FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
					<InputLabel htmlFor="outlined-adornment-password">
						Password
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={showPassword ? "text" : "password"}
						{...register("password", {
							onChange: (e) => setPassword(e.target.value), // keeps live requirement check
							onBlur: (e) => {
								if (!isSubmitting) {
									setShowRequirements(false); // only hide when not submitting
								}
							}, // keeps hide-on-blur
						})}
						onFocus={() => setShowRequirements(true)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? (
										<VisibilityOff />
									) : (
										<Visibility />
									)}
								</IconButton>
							</InputAdornment>
						}
						label="Password"
					/>
				</FormControl>
				{showRequirements && (
					<ul className="passwordRequirements marginP">
						<li
							className={
								password.length >= 8 ? "valid" : "invalid"
							}
						>
							At least 8 characters
						</li>
						<li
							className={
								/[a-z]/.test(password) ? "valid" : "invalid"
							}
						>
							At least one lowercase letter
						</li>
						<li
							className={
								/[A-Z]/.test(password) ? "valid" : "invalid"
							}
						>
							At least one uppercase letter
						</li>
						<li
							className={
								/[0-9]/.test(password) ? "valid" : "invalid"
							}
						>
							At least one number
						</li>
						<li
							className={
								/[^A-Za-z0-9]/.test(password)
									? "valid"
									: "invalid"
							}
						>
							At least one special character
						</li>
					</ul>
				)}
				{errors.password && (
					<p className="signupError marginP">
						{" "}
						{errors.password.message}
					</p>
				)}
				<div className="loginWrapBottom">
					<button
						type="submit"
						className="input"
						disabled={isSubmitting}
					>
						Sign up
					</button>
				</div>
			</form>
		</>
	);
};
