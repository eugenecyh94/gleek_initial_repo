import { Toolbar } from "@mui/material";
import Layout from "./Layout";
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
};
export default Home;
