import { useTheme } from "@emotion/react";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useVendorStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import VendorsTable from "./VendorsTable";

const ViewAllVendors = () => {
  const theme = useTheme();
  const { vendors, getVendors, isLoading, updateVendor } = useVendorStore();
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
        <VendorsTable
          vendors={vendors}
          updateVendor={updateVendor}
        ></VendorsTable>
      )}
    </MainBodyContainer>
  );
};

export default ViewAllVendors;
