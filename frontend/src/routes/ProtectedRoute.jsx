import React from "react";

const ProtectedRoute = ({ children, openAuth }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    openAuth(); // open modal if not logged in
    return null; // don't navigate
  }

  return children;
};

export default ProtectedRoute;

