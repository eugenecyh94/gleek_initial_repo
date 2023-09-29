import { CircularProgress, Toolbar, Typography, useTheme } from "@mui/material";
import Layout from "../Layout";
import styled from "@emotion/styled";
import { useAdminStore, useVendorStore } from "../../zustand/GlobalStore";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CreateVendorForm from "./CreateVendorForm";
import { useEffect } from "react";
import MainBodyContainer from "../common/MainBodyContainer";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateVendorPage = () => {
  const { vendorTypesFetcher, createVendor, vendorTypes } = useVendorStore();
  const { admin } = useAdminStore();
  const theme = useTheme();
  useEffect(() => {
    vendorTypesFetcher();
  }, []);
  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={["View All Vendors"]}
        breadcrumbLinks={["/viewAllVendors"]}
        currentBreadcrumbName={"Add Vendor"}
      >
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
        <CreateVendorForm
          vendorTypes={vendorTypes}
          addVendor={createVendor}
          admin={admin}
        />
      </MainBodyContainer>
    </StyledPage>
  );
};

export default CreateVendorPage;
