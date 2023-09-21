import styled from "@emotion/styled";
import { CircularProgress, Toolbar, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useThemeStore, useVendorStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import CreateActivityForm from "./CreateActivityForm";
import CreateIcon from "@mui/icons-material/Create";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateActivityPage = () => {
  const theme = useTheme();
  const { themes, getThemes, isLoading } = useThemeStore();
  const { vendors, getVendors } = useVendorStore();

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
      <Layout>
        <Toolbar />
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
          <CreateIcon />
          Create Activity
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <CreateActivityForm
            themes={themesList}
            theme={theme}
            vendors={vendors}
          ></CreateActivityForm>
        )}
      </Layout>
    </StyledPage>
  );
};
export default CreateActivityPage;
