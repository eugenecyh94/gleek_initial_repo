import { useTheme } from "@emotion/react";
import React from "react";
import { CircularProgress, Toolbar, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useClientStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import ClientsTable from "./ClientsTable";
import BreadCrumbsBar from "../common/BreadCrumbsBar";

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
    <MainBodyContainer hasBackButton={false} breadcrumbNames={[]} breadcrumbLinks={[]} currentBreadcrumbName={"View All Clients"}>
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
      </MainBodyContainer>
  );
};

export default ViewAllClients;
