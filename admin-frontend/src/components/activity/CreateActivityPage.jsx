import { CircularProgress, Toolbar, Typography, useTheme } from "@mui/material";
import Layout from "../Layout";
import CreateActivityForm from "./CreateActivityForm";
import { useThemeStore } from "../../zustand/GlobalStore";
import { useEffect } from "react";

const CreateActivityPage = () => {
  const theme = useTheme();
  const { themes, getThemes, isLoading } = useThemeStore();

  const themesList = themes.data;

  useEffect(() => {
    console.log("Use Effect");
    const fetchData = async () => {
      await getThemes();
    };
    fetchData();
  }, [getThemes]);

  return (
    <Layout>
      <Toolbar />
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Create Activity
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <CreateActivityForm
          themes={themesList}
          theme={theme}
        ></CreateActivityForm>
      )}
    </Layout>
  );
};
export default CreateActivityPage;
