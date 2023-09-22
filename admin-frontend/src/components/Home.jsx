import { Toolbar } from "@mui/material";
import Layout from "./Layout";
<<<<<<< HEAD
import MainBodyContainer from "./common/MainBodyContainer";

const Home = () => {
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Home"}
    >
      Home
    </MainBodyContainer>
  );
=======
import SideNavBar from "./navbar/SideNavBar";
import { useAdminStore } from "../zustand/GlobalStore";

const Home = () => {
   const { authenticated } = useAdminStore();
   return (
      <Layout>
         <Toolbar />
         {authenticated ? <SideNavBar /> : <></>}
         Home
      </Layout>
   );
>>>>>>> develop
};
export default Home;
