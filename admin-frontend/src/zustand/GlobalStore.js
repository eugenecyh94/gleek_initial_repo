import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect.js";
// import update from "immutability-helper";
// import { devtools } from "zustand/middleware";

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
  token: null,
  admins: null,
  setAdmin: (admin) => set({ admin }),
  setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
  login: async (email, password) => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.post("/gleekAdmin/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      set({
        admin: data.admin,
        authenticated: true,
        token: data.token,
      });
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
  logout: async () => {
    // Implement your logout logic and update authenticated state
    set({
      admin: null, // Clear admin data
      authenticated: false, // Set authenticated to false
    });
    try {
      const response = await AxiosConnect.get("/gleekAdmin/logout");
      setTimeout(() => {
        set({
          isLoading: false,
          admin: null,
          authenticated: false,
          adminError: null,
          token: null,
        });
      }, 500);
    } catch (err) {
      console.log("ERROR: ", err.message);
    }
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
  recoverPassword: async (email) => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/recoverPassword", {
        email: email,
      });
      const data = response.data;
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  register: async (newAdmin) => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.post(
        "/gleekAdmin/register",
        newAdmin
      );
      const data = response.data;
      console.log(data);
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  getAllAdmins: async () => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.get("/gleekAdmin");
      const data = response.data;
      console.log(data);
      setTimeout(() => {
        set({ isLoading: false, admins: response.data });
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}));

export const useActivityStore = create((set) => ({
  activities: [],
  isLoading: false,
  newActivity: null,
  activityDetails: {},
  selectedTab: "publishedTab",
  pendingApprovalActivities: [],
  selectedActivityTab: "publishedTab",
  setSelectedTab: (thing) => {
    set({ selectedTab: thing });
  },
  setSelectedActivityTab: (thing) => {
    set({ selectedActivityTab: thing });
  },
  getActivity: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/activity/all");
      set({
        activities: response.data.publishedActivities,
        pendingApprovalActivities: response.data.pendingApprovalActivities,
      });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  getActivityForAdmin: async (adminId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/activity/myActivities/${adminId}`
      );
      set({ activities: response.data.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  createActivity: async (newActivityData) => {
    try {
      const response = await AxiosConnect.postMultiPart(
        "/activity/addActivity",
        newActivityData
      );
      set({ newActivity: response.data.activity });
    } catch (error) {
      console.error("Unexpected Server Error!", error);
      throw new Error("Unexpected Server Error!");
    }
  },
  getSingleActivity: async (activityId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/activity/viewActivity/${activityId}`
      );
      set({ activityDetails: response.data.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  saveActivity: async (activityDraftData) => {
    try {
      const response = await AxiosConnect.postMultiPart(
        "/activity/saveActivity",
        activityDraftData
      );
      set({ newActivity: response.data.activity });
    } catch (error) {
      console.log(error);
    }
  },
  deleteActivity: async (activityId) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        `/activity/deleteDraft/${activityId}`
      );
      set({ activities: updatedActivities.data.activity });
      set({ selectedTab: "draftTab" });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
  bulkDeleteActivity: async (activityIds) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        "/activity/bulkDelete",
        activityIds
      );
      set({
        activities: updatedActivities.data.activity,
        selectedTab: "draftTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
}));

export const useThemeStore = create((set) => ({
  themes: [],
  isThemeLoading: false,
  getThemes: async () => {
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.get("/activity/getThemes");
      set({ themes: response.data });
      set({ isThemeLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useSnackbarStore = create((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  openSnackbar: (message, type = "success") => {
    set({ isOpen: true, message, type });
  },
  closeSnackbar: () => {
    set({ isOpen: false, message: "", type: "success" });
  },
}));

export const useVendorStore = create((set) => ({
  vendors: [],
  vendor: null,
  isVendorLoading: false,
  vendorTypes: {},
  getVendors: async () => {
    try {
      set({ isVendorLoading: true });
      const response = await AxiosConnect.get("/vendor/viewAllVendors");
      set({ vendors: response.data });
      set({ isVendorLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  updateVendor: async (id, payload) => {
    try {
      set(() => ({ isLoading: true }));
      await AxiosConnect.patch("vendor/updateVendor", id, payload);
      const response = await AxiosConnect.get("/vendor/viewAllVendors");
      set({ vendors: response.data });
      set(() => ({ isLoading: false }));
    } catch (error) {
      console.error(error);
    }
  },
  createVendor: async (vendorData) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.post("/vendor/addVendor", vendorData);
      set({ vendor: response.data });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  vendorTypesFetcher: async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/vendor/getAllVendorTypes"
      );
      const data = response.data;
      set({ vendorTypes: data.VendorTypeEnum });
    } catch (error) {
      console.error(error);
    }
  },
  vendorDetails: {},
  getVendorDetails: async (vendorId) => {
    try {
      set({ isLoading: true });
      console.log("vendorId", vendorId);
      const response = await AxiosConnect.get(`/vendor/viewVendor/${vendorId}`);
      set({ vendorDetails: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useClientStore = create((set) => ({
  clients: [],
  isLoading: false,
  getClients: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/client/getAllClients");
      set({ clients: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  updateClient: async (id, payload) => {
    try {
      set(() => ({ isLoading: true }));
      await AxiosConnect.patch("client/update", id, payload);
      const response = await AxiosConnect.get("/client/getAllClients");
      set({ clients: response.data });
      set(() => ({ isLoading: false }));
    } catch (error) {
      console.error(error);
    }
  },
  clientDetails: {},
  getClientDetails: async (clientId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/client/getClientDetails/${clientId}`
      );
      set({ clientDetails: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useImageUploadTestStore = create((set) => ({
  testActivities: [],
  setTestActivities: (newActivityList) => {
    set({ testActivities: newActivityList });
  },
}));
