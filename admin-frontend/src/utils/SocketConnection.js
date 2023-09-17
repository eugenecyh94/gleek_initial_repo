import { useEffect } from "react";
import { useAdminStore } from "../zustand/GlobalStore.js";
import AxiosConnect from "./AxiosConnect.js";

const SocketConnection = () => {
   const { setAuthenticated, setAdmin } = useAdminStore();
   const initialiseData = async () => {
      try {
         const response = await AxiosConnect.post("/gleekAdmin/validate-token");
         const data = response.data;
         console.log(data);

         setAuthenticated(true);
         setAdmin(data.admin);
      } catch (error) {
         setAuthenticated(false);
         setAdmin(null);
      }
   };

   useEffect(() => {
      initialiseData();
   }, []);

   return <></>;
};

export default SocketConnection;
