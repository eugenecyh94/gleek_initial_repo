import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useActivityStore from "../../../zustand/ActivityStore";
import useThemeStore from "../../../zustand/ActivityThemeStore";
import CreateActivityForm from "./CreateActivityForm";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const EditActivityDraftPage = () => {
  const theme = useTheme();
  const { activityId } = useParams();
  const { getSingleActivity, activityDetails, isLoading } = useActivityStore();
  const { themes, getThemes, isThemeLoading } = useThemeStore();

  const themesList = themes.data;

  useEffect(() => {
    const fetchData = async () => {
      await getThemes();
      await getSingleActivity(activityId);
    };
    fetchData();
  }, []);

  return (
    <StyledPage>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
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
        {isLoading || isThemeLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateActivityForm
            themes={themesList}
            theme={theme}
            activity={activityDetails}
          ></CreateActivityForm>
        )}
      </Box>
    </StyledPage>
  );
};
export default EditActivityDraftPage;
