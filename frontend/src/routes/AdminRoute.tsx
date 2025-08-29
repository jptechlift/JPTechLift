import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { auth } from "../services/auth";

function isAdmin() {
  const token = auth.getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    return role === "admin";
  } catch {
    return false;
  }
}

export default function AdminRoute({ children }: { children: JSX.Element }) {
  return isAdmin() ? children : <Navigate to="/login" replace />;
}