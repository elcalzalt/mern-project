
import { useState } from "react";
import "../App.css";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Link } from "react-router-dom";
export const LoginPage = () => {
  const [changeSignInUp, setChangeSignInUp] = useState(true);
  const [changeTextSign, setChangeTextSign] = useState(true);
  const change = () => setChangeSignInUp((changed) => !changed);
  const changeText = () => setChangeTextSign((changedText) => !changedText);
  return (
    <>
      <div className="rotateNotice">
        <p className="warning">
          Please rotate your device back to portrait mode.
        </p>
      </div>
      <div className="main">
        <h1 className="brandName">TIF.</h1>
        <h2 className="brandNameDesc">Plan better - Work easier</h2>
        <div className="mainBoard">
          <section className="mainBoardLeft">
            {changeSignInUp ? <Login /> : <Signup />}
            <p
              className="changeCta"
              onClick={() => {
                change(), changeText();
              }}
              style={{
                cursor: "pointer",
                marginTop: "15px",
                textDecoration: "underline",
              }}
            >
              {changeTextSign
                ? "New User? Sign up"
                : "Already a member? Sign in"}
            </p>
            <p className="passwordReset">
  <Link className="passwordReset" to="/forgot-password">Forgot your password? Click here</Link>
</p>
          </section>
          <section className="mainBoardRight">
            <div className="RightContent">
              "TIF helps you plan, track, and stay consistent with your
              workouts. Build better habits, set clear goals, and make every
              session count."
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
