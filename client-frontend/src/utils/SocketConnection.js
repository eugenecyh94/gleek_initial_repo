import { useEffect } from "react";
import useClientStore from "../zustand/clientStore";
import AxiosConnect from "./AxiosConnect";

const SocketConnection = () => {
  const { setAuthenticated, setClient } = useClientStore();
  const initialiseData = async () => {
    try {
      const response = await AxiosConnect.post("/gleek/validate-token");
      const data = response.data;

      setAuthenticated(true);
      setClient(data.client);
    } catch (error) {
      setAuthenticated(false);
      setClient(null);
    }
  };

  useEffect(() => {
    initialiseData();
  }, []);

  return <></>;
};

export default SocketConnection;
