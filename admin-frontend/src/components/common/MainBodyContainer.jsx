import { useTheme } from "@emotion/react";
import React from "react";
import { Box } from "@mui/material";
import BreadCrumbsBar from "./BreadCrumbsBar";
import { useAdminStore } from "../../zustand/GlobalStore";

const MainBodyContainer = ({children, hasBackButton, breadcrumbNames ,breadcrumbLinks, currentBreadcrumbName }) => {
  const theme = useTheme();
  const { authenticated } = useAdminStore();
  const marginLeft = authenticated ? "240px" : "0px";

  return (

    <Box marginTop={"64px"} marginLeft={marginLeft}>
      <BreadCrumbsBar hasBackButton={hasBackButton} breadcrumbNames={breadcrumbNames} breadcrumbLinks={breadcrumbLinks} currentBreadcrumbName={currentBreadcrumbName}/>
      <Box marginTop={"20px"} marginLeft={"30px"} marginRight={"30px"}>
        {children}
      </Box>
    </Box>

  );
};

export default MainBodyContainer;
