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

//Based on survey form suzanna provided
//5 types, including others, each leading to different inputs/components
//Talk, Workshop, Learning Journey, Popups, Others
//Pop up fields haven't been included
//Most fields commented for ease of initial build
const currentActivityCreationForm = {
  vendor: "Admin", //vendor ID, dropdown for admin to select, else default will be admin
  activityType: "",
  activityName: "",
  activityDescription: "",
  activityTitle: "", //for learning journey
  additionalDetails: "", //for others.
  idealDuration: 0,
  themes: [""],
  sdg: [""],
  minParticipants: 0,
  maxParticipants: 0,
  availability: "", //dropdown
  availabilitySpecifics: "",
  differentCharges: false,
  pictures: [""], //to be changed to object after pic upload implemented
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

export const useActivityCreationFormStore = create((set) => ({
  currentActivityCreationForm,
}));

export const useImageUploadTestStore = create((set) => ({
  imageList: [],
  setImageList: (newImageList) => {
    set({ imageList: newImageList });
    console.log(useImageUploadTestStore.getState());
  },
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
      const response = await AxiosConnect.post("/gleekAdmin/login", {
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
      console.log(error);
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
  changePassword: async (password) => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/changePassword", {
        password: password,
      });
      const data = response.data;
      set({ admin: data.admin, authenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          adminError: error,
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
}));
