import { useTheme } from "@emotion/react";
import React from "react";
import { Box } from "@mui/material";
import BreadCrumbsBar from "./BreadCrumbsBar";

const MainBodyContainer = ({
  children,
  hasBackButton,
  breadcrumbNames,
  breadcrumbLinks,
  currentBreadcrumbName,
}) => {
  const theme = useTheme();

  return (
    <Box >
      <BreadCrumbsBar
        hasBackButton={hasBackButton}
        breadcrumbNames={breadcrumbNames}
        breadcrumbLinks={breadcrumbLinks}
        currentBreadcrumbName={currentBreadcrumbName}
      />
      <Box marginTop={"20px"} marginLeft={"30px"} marginRight={"30px"}>
        {children}
      </Box>
    </Box>
  );
};

export default MainBodyContainer;
