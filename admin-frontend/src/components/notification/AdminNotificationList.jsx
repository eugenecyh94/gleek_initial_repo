import { useEffect, useState } from "react";
import AdminNotificationContent from "./AdminNotificationContent";

const AdminNotificationList = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState(
    notifications.slice(0, 10),
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items to load per page

  const loadMoreNotifications = () => {
    // Calculate the next page to load
    const nextPage = page + 1;
    setPage(nextPage);

    // Slice the next batch of notifications from the data
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextBatch = notifications.slice(startIndex, endIndex);

    // Append the new batch to the visibleNotifications
    setVisibleNotifications((prevNotifications) => [
      ...prevNotifications,
      ...nextBatch,
    ]);
  };

  // Attach a scroll event listener to the window to detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Check if the user has scrolled to the bottom of the page
      if (windowHeight + scrollTop >= documentHeight - 200) {
        loadMoreNotifications();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Initial load of notifications
    loadMoreNotifications();
  }, []);

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      {visibleNotifications.map((notification, index) => (
        <AdminNotificationContent key={index} notification={notification} />
      ))}
    </div>
  );
};

export default AdminNotificationList;
