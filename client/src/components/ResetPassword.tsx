import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import "./PasswordReset.css";
import TextField from "@mui/material/TextField";
import { API_BASE_URL } from "../config";
const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				`${API_BASE_URL}/api/user/reset-password`,
				{ token, password }
			);
			setMessage(res.data.message);
			setTimeout(() => navigate("/"), 2000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			setMessage(
				error.response?.data?.message || "Error resetting password"
			);
		}
	};

	return (
		<div className="auth-container">
			<div className="content">
				<h2>Reset Password</h2>
				<form
					onSubmit={handleSubmit}
					style={{
						display: "flex",
						gap: "10px",
						flexDirection: "column",
						width: "100%",
						alignItems: "center",
					}}
				>
					<TextField
						type="password"
						placeholder="Enter new password"
						value={password}
						sx={{ width: "70%" }}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setPassword(e.target.value)
						}
						required
					/>
					<button
						type="submit"
						style={{ width: "30%", minWidth: "200px" }}
					>
						Reset Password
					</button>
				</form>
				{message && (
					<p
						style={{
							fontSize: "20px",
							fontWeight: "500",
							color: "red",
						}}
					>
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default ResetPassword;
