import { useState } from "react";
import type {FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/user/request-password-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
