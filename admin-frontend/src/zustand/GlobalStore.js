import { create } from "zustand";
// import update from "immutability-helper";
// import { devtools } from "zustand/middleware";

const currentActivity = {
  title: "",
  description: "",
  tags: {
    theme: [""],
    type: [""],
    duration: "",
    location: [""],
    size: [""],
  },
  price: 0,
  image: "",
};
const currentBooking = {
  bookingId: "",
  activityId: "",
  date: 0,
  status: "",
};
const allActivities = [currentActivity];
const allBookings = [currentBooking];

export const useActivityStore = create((set) => ({
  currentActivity,
  allActivities,
}));

export const useBookingStore = create((set) => ({
  currentBooking,
  allBookings,
}));

export const updateCurrentActivity = (selectedActivity) => {
  useActivityStore.setState((prevState) => ({
    ...prevState,
    currentActivity: selectedActivity,
  }));
  console.log(
    "activity store current activity updated::",
    useActivityStore.getState(),
  );
};

export const updateAllActivity = (newAllActivities) => {
  useActivityStore.setState((prevState) => ({
    ...prevState,
    allActivities: newAllActivities,
  }));
  console.log(
    "activity store all activity updated::",
    useActivityStore.getState(),
  );
};

export const useSelectedNavItemStore = create((set) => ({
  selectedItem: "Home",
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
