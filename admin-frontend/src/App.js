import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ViewPublishedActivities from "./components/activity/ViewPublishedActivities";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import ChangePassword from "./components/profile/ChangePassword.jsx";
import ResetPassword from "./components/ResetPassword";
import ViewAllVendors from "./components/vendor/ViewAllVendors";
import ViewAllClients from "./components/client/ViewAllClients";
import ClientDetails from "./components/client/ClientDetails";
import CreateActivityPage from "./components/activity/CreateActivityPage";
import ImageAndFileUpload from "./components/activityCreation/ImageAndFileUpload";
import SocketConnection from "./utils/SocketConnection";
import ForgotPassword from "./components/ForgotPassword";
import AccountDetails from "./components/profile/AccountDetails";
import AddAdminPage from "./components/admin/AddAdminPage";

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
            path="/viewAllVendors"
            element={
              <ProtectedRoute>
                <ViewAllVendors />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/resetPassword"
            element={
              <ProtectedRoute>
                <ResetPassword />
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
                  path="/adminTeam/addAdmin"
                  element={
                     <ProtectedRoute>
                        <AddAdminPage />
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
          <Route path="/login" element={<LoginPage />} />
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
