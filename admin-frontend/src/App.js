import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ViewPublishedActivities from "./components/activity/ViewPublishedActivities";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import ResetPassword from "./components/ResetPassword";
import ViewAllVendors from "./components/vendor/ViewAllVendors";
import SocketConnection from "./utils/SocketConnection";
import ForgotPassword from "./components/ForgotPassword";

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
                  path="/changePassword"
                  element={
                     <ProtectedRoute>
                        <ChangePassword />
                     </ProtectedRoute>
                  }
               />
               <Route path="/login" element={<LoginPage />} />
               <Route
                  exact
                  path="/forgotPassword"
                  element={<ForgotPassword />}
               />
            </Routes>
         </Layout>
      </div>
   );
}

export default App;
