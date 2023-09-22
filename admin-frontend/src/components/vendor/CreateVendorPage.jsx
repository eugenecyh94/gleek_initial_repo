import { CircularProgress, Toolbar, Typography, useTheme } from "@mui/material";
import Layout from "../Layout";
import styled from "@emotion/styled";
import { useAdminStore, useVendorStore } from "../../zustand/GlobalStore";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CreateVendorForm from "./CreateVendorForm";
import { useEffect } from "react";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateVendorPage = () => {
  const { vendorTypesFetcher, createVendor, isLoading, vendorTypes } =
    useVendorStore();
  const { admin } = useAdminStore();
  const theme = useTheme();
  useEffect(() => {
    vendorTypesFetcher();
  }, []);
  return (
    <StyledPage>
      <Layout>
        <Toolbar />
        <Typography
          alignItems={"center"}
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
          paddingBottom={2}
          style={{
            display: "flex",
          }}
        >
          <PersonAddAlt1Icon />
          Add Vendor
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateVendorForm
            vendorTypes={vendorTypes}
            addVendor={createVendor}
            admin={admin}
          ></CreateVendorForm>
        )}
      </Layout>
    </StyledPage>
  );
};

export default CreateVendorPage;
