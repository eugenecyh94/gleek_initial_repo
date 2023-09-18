import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import SocketConnection from "./utils/SocketConnection";
import ViewPublishedActivities from "./components/ViewPublishedActivities";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import MultiStepActivityCreationForm from "./components/activityCreation/MultiStepActivityCreationForm";
import ImageAndFileUpload from "./components/activityCreation/ImageAndFileUpload";

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
            element={
              <ProtectedRoute>
                <ViewPublishedActivities />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/changePassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/createActivity"
            element={<MultiStepActivityCreationForm />}
          />
          {/*for testing image upload component*/}
          <Route
            path="/uploadTest"
            element={
              <ImageAndFileUpload limit={5} name="test" size={2000000} />
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
