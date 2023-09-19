import { useTheme } from "@emotion/react";
import { CircularProgress, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useClientStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import ClientsTable from "./ClientsTable";

const ViewAllClients = () => {
  const theme = useTheme();
  const { clients, getClients, isLoading, updateClient } = useClientStore();
  useEffect(() => {
    const fetchData = async () => {
      await getClients();
    };
    fetchData();
  }, [getClients]);

  return (
    <Layout>
      <Toolbar />
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        View All Clients
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <ClientsTable
          clients={clients}
          updateClient={updateClient}
        ></ClientsTable>
      )}
    </Layout>
  );
};

export default ViewAllClients;
