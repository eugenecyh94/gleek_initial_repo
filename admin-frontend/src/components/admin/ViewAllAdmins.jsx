import { useTheme } from "@emotion/react";
import { CircularProgress, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAdminStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import ViewAllAdminsTable from "./ViewAllAdminsTable";

const ViewAllAdmins = () => {
   const theme = useTheme();
   const { admin, authenticated, isLoading, getAllAdmins, admins } =
      useAdminStore();
   useEffect(() => {
      const fetchData = async () => {
         await getAllAdmins();
         console.log(admins);
      };
      fetchData();
   }, [getAllAdmins]);

   return (
      <Layout>
         <Toolbar />
         <Typography
            fontSize={25}
            fontWeight={700}
            noWrap
            component="div"
            color={theme.palette.primary.main}>
            View All Admins
         </Typography>
         {isLoading ? (
            <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
         ) : (
            <ViewAllAdminsTable admins={admins} />
         )}
      </Layout>
   );
};

export default ViewAllAdmins;
