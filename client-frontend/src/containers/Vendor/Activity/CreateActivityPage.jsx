import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import CreateActivityForm from "./CreateActivityForm";
import useThemeStore from "../../../zustand/ActivityThemeStore";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateActivityPage = () => {
  const theme = useTheme();
  const { themes, getThemes, isThemeLoading } = useThemeStore();

  const themesList = themes.data;

  useEffect(() => {
    const fetchData = async () => {
      await getThemes();
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
          Create Activity
        </Typography>
        {isThemeLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateActivityForm
            themes={themesList}
            theme={theme}
          ></CreateActivityForm>
        )}
      </Box>
    </StyledPage>
  );
};
export default CreateActivityPage;
