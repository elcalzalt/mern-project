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
const signInSchema = z.object({
  email:z.email("Please enter valid email"),
  password: z.string().min(6, "At least 6 character for password"),
});
type SignInFormValues = z.infer<typeof signInSchema>;
export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });
  const onSubmit = async (data: SignInFormValues) => {
    setUsername(data.email);
    setPassword(data.password);
    await handleLogin(data.email, data.password);
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:5050/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);  // save JWT
      navigate("/feature");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};


  return (
    <>
      <form className="loginWrap" id="login" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="welcome">Welcome back</h2>
        <TextField
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="email"
          variant="outlined"
          fullWidth
          {...register("email")}
        />
        {errors.email && (
          <p className="signupError marginP"> {errors.email.message}</p>
        )}
        <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {errors.password && (
          <p className="signupError marginP"> {errors.password.message}</p>
        )}
        <div className="loginWrapBottom input">
          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </div>
      </form>
    </>
  );
};
