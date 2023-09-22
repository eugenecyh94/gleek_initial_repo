import { useTheme } from "@emotion/react";
import { CircularProgress, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useVendorStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import VendorsTable from "./VendorsTable";
import MainBodyContainer from "../common/MainBodyContainer";

const ViewAllVendors = () => {
  const theme = useTheme();
  const { vendors, getVendors, isLoading } = useVendorStore();
  useEffect(() => {
    const fetchData = async () => {
      await getVendors();
    };
    fetchData();
  }, [getVendors]);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"View All Vendors"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        View All Vendor Partners
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <VendorsTable vendors={vendors}></VendorsTable>
      )}
    </MainBodyContainer>
  );
};

export default ViewAllVendors;
