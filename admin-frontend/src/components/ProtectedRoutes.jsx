import React, { useEffect, useState } from "react";
import AxiosConnect from "../utils/AxiosConnect";
import { useAdminStore } from "../zustand/GlobalStore";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setAdmin, setAuthenticated, authenticated } = useAdminStore();

  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    AxiosConnect.post("/gleekAdmin/validate-token")
      .then((response) => {
        console.log(response);
        setAuthenticated(true);
        setIsLoading(false); // Mark loading as complete
      })
      .catch((error) => {
        console.log(error);
        setAuthenticated(false);
        setIsLoading(false); // Mark loading as complete
        setAdmin(null);
        navigate("/login");
      });
  }, []);

  // Render nothing while loading
  if (isLoading) {
    return null;
  }

  return authenticated ? <div>{children}</div> : <div></div>;
};

export default ProtectedRoute;
