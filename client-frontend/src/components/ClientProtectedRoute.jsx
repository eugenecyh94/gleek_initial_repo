import React, { useEffect, useState } from "react";
import AxiosConnect from "../utils/AxiosConnect";
import useClientStore from "../zustand/ClientStore";
import { useNavigate } from "react-router-dom";

const ClientProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setClient, setAuthenticated, authenticated, client } =
    useClientStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await AxiosConnect.post("/gleek/auth/validate-token");
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
        setClient(null);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [navigate, authenticated, client]);

  if (isLoading) {
    return null;
  }

  return authenticated ? <div>{children}</div> : null;
};

export default ClientProtectedRoute;
