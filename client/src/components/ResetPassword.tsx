import { useState } from "react";
import type {FormEvent, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/user/reset-password", { token, password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
