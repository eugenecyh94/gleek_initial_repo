import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputLabel,
} from "@mui/material";
import useClientStore, { useAdminStore } from "../../zustand/GlobalStore";
import ManageProfileSidebar from "./ManageProfileSidebar";
import dayjs from "dayjs";
import MainBodyContainer from "../common/MainBodyContainer";

function AccountDetails(props) {
  const { admin } = useAdminStore();
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      currentBreadcrumbName={"Account Details"}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="top"
        p={8}
        width={"100%"}
      >
        <Box width={"20%"}>
          <ManageProfileSidebar />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          width={"100%"}
          p={6}
          flexWrap={"wrap"}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            marginBottom={2}
          >
            <Typography color="secondary" variant="h4">
              Account Details
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography color="primary" variant="h7">
                User Information
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                value={admin.name}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                value={admin.email}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="role"
                name="role"
                label="Role"
                value={admin.role}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={admin.phoneNumber ? admin.phoneNumber : ""}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="creationDate"
                name="creationDate"
                label="Creation Date"
                value={dayjs(admin.creationDate).format("DD/MM/YYYY")}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainBodyContainer>
  );
}

export default AccountDetails;
