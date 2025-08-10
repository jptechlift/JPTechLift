import { Navigate } from "react-router-dom";
import { authMock } from "../services/authMock";
import { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  return authMock.getToken() ? children : <Navigate to="/login" replace />;
}
