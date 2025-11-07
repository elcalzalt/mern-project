import "./App.css";
import { LoginPage } from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Feature from "./components/Feature";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <nav>
          {/* Link replaces <a> for client-side routing */}
          <Link to="/">Home</Link> | <Link to="/feature">Feature</Link>
        </nav>

        <Routes>
          <Route
            path="/feature"
            element={
              <ProtectedRoute>
                <Feature />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
