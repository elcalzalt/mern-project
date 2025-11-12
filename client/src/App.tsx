import "./App.css";
import { LoginPage } from "./components/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feature from "./components/Feature";
import VerifyEmail from "./components/VerifyEmail";
import { Toaster } from "sonner";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          <Route path="/feature" element={<Feature />} />

          <Route path="/" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
