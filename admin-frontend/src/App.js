import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ViewPublishedActivities from "./components/activity/ViewPublishedActivities";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import ChangePassword from "./components/profile/ChangePassword.jsx";
import ViewAllVendors from "./components/vendor/ViewAllVendors";
import ViewAllClients from "./components/client/ViewAllClients";
import ClientDetails from "./components/client/ClientDetails";
import CreateActivityPage from "./components/activity/CreateActivityPage";
import ImageAndFileUpload from "./components/activityCreation/ImageAndFileUpload";
import CreateVendorPage from "./components/vendor/CreateVendorPage";
import SocketConnection from "./utils/SocketConnection";
import ForgotPassword from "./components/ForgotPassword";
import AccountDetails from "./components/profile/AccountDetails";
import AddAdminPage from "./components/admin/AddAdminPage";
import ViewAllAdmins from "./components/admin/ViewAllAdmins";
import VendorDetails from "./components/vendor/VendorDetails";
import ActivityDetails from "./components/activity/ActivityDetails";
import ViewActivityDrafts from "./components/activity/ViewActivityDrafts";
import EditActivityDraftPage from "./components/activity/EditActivityDraftPage";
import AdminNotificationPage from "./components/notification/AdminNotificationPage";
import VerifyEmailPage from "./components/VerifyEmailPage";

function App() {
  return (
    <div>
      <SocketConnection />
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/createActivity"
            element={
              <ProtectedRoute>
                <CreateActivityPage />
              </ProtectedRoute>
            }
          />
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
            path="/viewActivityDrafts"
            element={
              <ProtectedRoute>
                <ViewActivityDrafts />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/viewActivity/:activityId"
            element={
              <ProtectedRoute>
                <ActivityDetails />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/editActivityDraft/:activityId"
            element={
              <ProtectedRoute>
                <EditActivityDraftPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/viewAllVendors"
            element={
              <ProtectedRoute>
                <ViewAllVendors />
              </ProtectedRoute>
            }
          />
          {/* <Route
            exact
            path="/viewVendor/:vendorId"
            element={
              <ProtectedRoute>
                <VendorDetails />
              </ProtectedRoute>
            }
          /> */}
          <Route
            exact
            path="/addVendor"
            element={
              <ProtectedRoute>
                <CreateVendorPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/manageProfile/changePassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/manageProfile"
            element={
              <ProtectedRoute>
                <AccountDetails />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/adminTeam"
            element={
              <ProtectedRoute>
                <ViewAllAdmins />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/adminTeam/addAdmin"
            element={
              <ProtectedRoute>
                <AddAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/viewAllClients"
            element={
              <ProtectedRoute>
                <ViewAllClients />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/viewClient/:clientId"
            element={
              <ProtectedRoute>
                <ClientDetails />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/notificationList"
            element={
              <ProtectedRoute>
                <AdminNotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/verifyEmail/:token"
            element={<VerifyEmailPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
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
