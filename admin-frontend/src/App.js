import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import SocketConnection from "./utils/SocketConnection";
import ViewPublishedActivities from "./components/ViewPublishedActivities";

function App() {
  return (
    <div>
      <SocketConnection />
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/viewPublishedActivities"
            element={<ViewPublishedActivities />}
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
