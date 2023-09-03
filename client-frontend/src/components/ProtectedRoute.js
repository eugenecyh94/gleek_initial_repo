import React, { useEffect, useState } from "react";
import AxiosConnect from "../utils/AxiosConnect";
import useClientStore from "../zustand/clientStore";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setClient, setAuthenticated, authenticated } = useClientStore();

  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    if (!authenticated) {
      AxiosConnect.post("/gleek/validate-token")
        .then((response) => {
          console.log(response);
          setAuthenticated(true);
          setIsLoading(false); // Mark loading as complete
        })
        .catch((error) => {
          console.log(error);
          setAuthenticated(false);
          setIsLoading(false); // Mark loading as complete
          setClient(null);
          navigate("/login");
        });
    }
  }, []);

  // Render nothing while loading
  if (isLoading) {
    return null;
  }

  return authenticated ? <div>{children}</div> : <div></div>;
};

export default ProtectedRoute;
