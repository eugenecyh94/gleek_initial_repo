import React, { useEffect, useState } from "react";
import AxiosConnect from "../../utils/AxiosConnect";
import useClientStore from "../../zustand/ClientStore";
import { useNavigate } from "react-router-dom";
import useGlobalStore from "../../zustand/GlobalStore";

const ClientProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setClient, setAuthenticated, authenticated, client } =
    useClientStore();
  const [isLoading, setIsLoading] = useState(true);
  const { role, setRole } = useGlobalStore();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await AxiosConnect.post("/gleek/auth/validateToken");
        setAuthenticated(true);
        setClient(response.data.client);
        setRole("Client");
      } catch (error) {
        setAuthenticated(false);
        setClient(null);
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return authenticated ? <div>{children}</div> : null;
};

export default ClientProtectedRoute;
