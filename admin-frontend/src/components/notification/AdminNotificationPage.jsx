import { useAdminStore, useNotificationStore } from "../../zustand/GlobalStore";
import AxiosConnect from "../../utils/AxiosConnect";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import AdminNotificationList from "./AdminNotificationList";
import MainBodyContainer from "../common/MainBodyContainer";
import { useTheme } from "@emotion/react";

const AdminNotificationPage = () => {
  const adminCredentials = useAdminStore((state) => state.admin);
  const { notifications, unreadNotificationsCount } = useNotificationStore();
  const theme = useTheme();

  useEffect(() => {
    console.log(notifications);
    console.log(unreadNotificationsCount);
  }, []);

  useEffect(() => {
    let unreadCount = 0;
    notifications.map((notification) => {
      notification.read === false ? unreadCount++ : unreadCount;
    });
    console.log(unreadCount);
  }, []);

  // useEffect(() => {
  //     console.log(adminCredentials);
  //     // console.log(adminCredentials.email);
  //     // console.log(adminCredentials._id);
  // },[]);

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
      <AdminNotificationList notifications={notifications} />
    </MainBodyContainer>
  );
};

export default AdminNotificationPage;
