import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
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
      useActivityStore.getState()
   );
};

export const updateAllActivity = (newAllActivities) => {
   useActivityStore.setState((prevState) => ({
      ...prevState,
      allActivities: newAllActivities,
   }));
   console.log(
      "activity store all activity updated::",
      useActivityStore.getState()
   );
};

export const useSelectedNavItemStore = create((set) => ({
   selectedItem: "Home",
   setSelectedItem: (item) => set({ selectedItem: item }),
}));

export const useAdminStore = create((set) => ({
   authenticated: false,
   admin: null,
   adminError: null,
   isLoading: false,
   setAdmin: (admin) => set({ admin }),
   setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
   login: async (email, password) => {
      set({ isLoading: true, adminError: null });
      try {
         const response = await AxiosConnect.post("/gleek/login", {
            email: email,
            password: password,
         });
         console.log(response);
         const data = response.data;
         set({ admin: data.admin, authenticated: true });
         setTimeout(() => {
            set({ isLoading: false });
         }, 500);
         return true;
      } catch (error) {
         setTimeout(() => {
            set({
               adminError: error,
               isLoading: false,
            });
         }, 500);
         return false;
      }
   },
   logout: () => {
      // Implement your logout logic and update authenticated state
      set({
         admin: null, // Clear admin data
         authenticated: false, // Set authenticated to false
      });
   },
}));
