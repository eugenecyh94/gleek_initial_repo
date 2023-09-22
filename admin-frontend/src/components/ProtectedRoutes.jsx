import React, { useEffect, useState } from "react";
import AxiosConnect from "../utils/AxiosConnect";
import { useAdminStore } from "../zustand/GlobalStore";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
   const navigate = useNavigate();
   const { setAdmin, setAuthenticated, authenticated, admin } = useAdminStore();

   const [isLoading, setIsLoading] = useState(true); // Initial loading state

   useEffect(() => {
      AxiosConnect.post("/gleekAdmin/validate-token")
         .then((response) => {
            console.log(response);
            setAuthenticated(true);
            setAdmin(response.data.admin);
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

   console.log(children);

   if (children.type.name === "AddAdminPage" && admin.role === "MANAGERIAL") {
      return <div>{children}</div>;
   } else if (
      children.type.name === "AddAdminPage" &&
      admin.role != "MANAGERIAL"
   ) {
      return navigate("/adminTeam");
   } else {
      return authenticated ? <div>{children}</div> : <div></div>;
   }
};

export default ProtectedRoute;
