
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    axios
      .post("http://localhost:5050/api/user/verify-email", { token })
      .then((res) => {
        // If backend returns a JWT or user info, store it here
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }
        setStatus("success");
        // Redirect after short delay
        setTimeout(() => navigate("/feature"), 1000);
      })
      .catch((err) => {
        console.error("Verification failed:", err.response?.data || err.message);
        setStatus("failed");
      });
  }, [token, navigate]);

  return (
    <div>
      {status === "verifying" && "Verifying your email..."}
      {status === "success" && "✅ Email verified successfully! Redirecting..."}
      {status === "failed" && "❌ Verification failed. Invalid or expired link."}
    </div>
  );
};

export default VerifyEmail;
