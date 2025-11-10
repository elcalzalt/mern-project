import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import "./PasswordReset.css";
import TextField from "@mui/material/TextField";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5050/api/user/request-password-reset",
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="content">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} style ={{display:"flex", gap:"10px", flexDirection:"column",width:"100%", alignItems:"center"}}>
          <TextField
            type="email"
            placeholder="Enter your email"
            value={email}
            sx={{width:"70%"}}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <button type="submit" style={{width:"30%", minWidth:"200px"}}>Send Reset Link</button>
        </form>
        {message && <p style={{fontSize: "20px", fontWeight: "500", color:"red"}}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
