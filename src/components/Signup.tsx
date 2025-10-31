import React from "react";
import { useState } from "react";
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
const signUpSchema = z.object({
  firstname: z.string().min(1, "At least 1 character for firstname"),
  lastname: z.string().min(1, "At least 1 character for lastname"),
  username: z.string().min(3, "At least 3 character for username"),
  password: z.string().min(6, "At least 6 character for password"),
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
  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
    alert("sign up successfully");
    // do something with the submitted form values
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

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Welcome ${data.username}!`);
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
          <p className="signupError marginP"> {errors.firstname.message}</p>
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
          <p className="signupError marginP"> {errors.lastname.message}</p>
        )}
        <TextField
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Username"
          variant="outlined"
          fullWidth
          {...register("username")}
        />
        {errors.username && (
          <p className="signupError marginP"> {errors.username.message}</p>
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
        <div className="loginWrapBottom">
          <button type="submit" className="input" disabled={isSubmitting}>
            Sign up
          </button>
        </div>
      </form>
    </>
  );
};
