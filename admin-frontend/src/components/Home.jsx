import { Toolbar } from "@mui/material";
import Layout from "./Layout";
import MainBodyContainer from "./common/MainBodyContainer";

const Home = () => {
<<<<<<< HEAD
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Home"}
    >
      Home
    </MainBodyContainer>
=======
  const { authenticated } = useAdminStore();
  return (
    <Layout>
      <Toolbar />
      {authenticated ? <SideNavBar /> : <></>}
      Home
    </Layout>
>>>>>>> develop
  );
};
export default Home;
