import { Navigate } from "react-router-dom";
import { auth } from "../services/auth";
import { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  return auth.getToken() ? children : <Navigate to="/login" replace />;
}