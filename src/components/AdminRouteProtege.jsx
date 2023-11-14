import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRouteProtege() {
    let isAuthentificated = sessionStorage.getItem("isLogged");
    let isAdmin = sessionStorage.getItem("isAdmin");
  return isAuthentificated === "true" && isAdmin === "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
