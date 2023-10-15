import { useAdminStore, useNotificationStore } from "../../zustand/GlobalStore";
import AxiosConnect from "../../utils/AxiosConnect";
import { useEffect, useState } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import AdminNotificationList from "./AdminNotificationList";
import MainBodyContainer from "../common/MainBodyContainer";
import { useTheme } from "@emotion/react";

const AdminNotificationPage = () => {
  const adminCredentials = useAdminStore((state) => state.admin);
  const { notifications, unreadNotificationsCount, setReceivedNotifications } =
    useNotificationStore();
  const [loading, setLoading] = useState(true); // Added loading state

  const theme = useTheme();

  useEffect(() => {
    // Fetch notifications when the component mounts
    AxiosConnect.getWithParams("/notification/adminAllNotifications", {
      adminId: adminCredentials._id,
      adminRole: adminCredentials.role,
    }).then((body) => {
      setReceivedNotifications(body.data.data);
      setLoading(false);
    });
  }, [setReceivedNotifications, adminCredentials]);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"All Notifications"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        All Notifications
      </Typography>
      {loading ? ( // Show circular progress if loading
        <CircularProgress />
      ) : (
        <AdminNotificationList notifications={notifications} />
      )}
    </MainBodyContainer>
  );
};

export default AdminNotificationPage;
