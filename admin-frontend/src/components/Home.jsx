import { Toolbar } from "@mui/material";
import Layout from "./Layout";
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
};
export default Home;
