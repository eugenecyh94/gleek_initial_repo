import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import {
  useActivityStore,
  useAdminStore,
  useThemeStore,
  useVendorStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import CreateActivityForm from "./CreateActivityForm";
import { useParams } from "react-router-dom";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const EditActivityDraftPage = () => {
  const theme = useTheme();
  const { activityId } = useParams();
  const { getSingleActivity, activityDetails, isLoading } = useActivityStore();
  const { themes, getThemes, isThemeLoading } = useThemeStore();
  const { vendors, getVendors, isVendorLoading } = useVendorStore();
  const { admin } = useAdminStore();

  const themesList = themes.data;

  useEffect(() => {
    console.log("Use Effect");
    const fetchData = async () => {
      await getThemes();
      await getVendors();
      await getSingleActivity(activityId);
    };
    fetchData();
  }, [getThemes]);

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={["View My Activities"]}
        breadcrumbLinks={["/viewActivityDrafts"]}
        currentBreadcrumbName={"Edit Activity Draft"}
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
          Edit Activity Draft
        </Typography>
        {isLoading || isThemeLoading || isVendorLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateActivityForm
            themes={themesList}
            theme={theme}
            vendors={vendors}
            admin={admin}
            activity={activityDetails}
          ></CreateActivityForm>
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};
export default EditActivityDraftPage;
