import { useEffect } from "react";
import { useAdminStore, useNotificationStore } from "../zustand/GlobalStore.js";
import AxiosConnect from "./AxiosConnect.js";

const SocketConnection = () => {
  const { setAuthenticated, setAdmin, admin } = useAdminStore();
  const { setReceivedNotifications } = useNotificationStore();
  const initialiseData = async () => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/validate-token");
      const data = response.data;
      setAuthenticated(true);
      setAdmin(data.admin);
      const params = {
        adminId: data.admin._id,
        adminRole: data.admin.role,
      };
      const notificationResponse = await AxiosConnect.getWithParams(
        "/notification/adminAllNotifications",
        params,
      ).then((body) => {
        console.log(body.data.data);
        setReceivedNotifications(body.data.data);
      });
    } catch (error) {
      setAuthenticated(false);
      setAdmin(null);
    }
  };

  useEffect(() => {
    initialiseData();
  }, []);

  return <></>;
};

export default SocketConnection;
