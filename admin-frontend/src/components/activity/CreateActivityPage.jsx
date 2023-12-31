import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import {
  useAdminStore,
  useThemeStore,
  useVendorStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import CreateActivityForm from "./CreateActivityForm";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateActivityPage = () => {
  const theme = useTheme();
  const { themes, getThemes, isThemeLoading } = useThemeStore();
  const { vendors, getVendors } = useVendorStore();
  const { admin } = useAdminStore();

  const themesList = themes.data;

  useEffect(() => {
    console.log("Use Effect");
    const fetchData = async () => {
      await getThemes();
      await getVendors();
    };
    fetchData();
  }, [getThemes]);

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={["View Published Activities"]}
        breadcrumbLinks={["/viewPublishedActivities"]}
        currentBreadcrumbName={"Create Activity"}
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
          <CreateIcon sx={{ marginRight: 1 }} />
          Create Activity
        </Typography>
        {isThemeLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateActivityForm
            themes={themesList}
            theme={theme}
            vendors={vendors}
            admin={admin}
          ></CreateActivityForm>
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};
export default CreateActivityPage;
