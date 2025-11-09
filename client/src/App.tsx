import "./App.css";
import { LoginPage } from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Feature from "./components/Feature";
import VerifyEmail from "./components/verifyEmail";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        

        <Routes>
          <Route
            path="/feature"
            element={
              
                <Feature />
              
            }
          />

          <Route path="/" element={<LoginPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
