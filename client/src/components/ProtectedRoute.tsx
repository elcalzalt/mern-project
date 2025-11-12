
import type { ReactElement } from "react";
import { Navigate} from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
