import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

export default function UtilisateurRouteProtege() {
    let isAuthentificated = sessionStorage.getItem("isLogged");
    let isUser = sessionStorage.getItem("isUser");
  return isAuthentificated === "true" && isUser === "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}
