import { Navigate, useLocation } from "react-router-dom";
import { useAppState } from "../store/AppStateContext.jsx";

export default function ProtectedRoute({ children }) {
  const { state } = useAppState();
  const location = useLocation();

  if (!state.auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
