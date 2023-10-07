import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBlockoutStore = create((set) => ({
  currentBlockout: null,
  activitiesWithBlockouts: [],
  isLoadingBlockouts: true,
  // getBlockouts: async () => {
  //   try {
  //     const response = await AxiosConnect.get(`/gleek/bookmark`);
  //     const data = response.data;
  //     console.log(data);
  //     const activityBlockouts = data.filter(
  //       (bookmark) => bookmark.type === "ACTIVITY",
  //     );
  //     const vendorBlockouts = data.filter(
  //       (bookmark) => bookmark.type === "VENDOR",
  //     );

  //     set({ isLoadingBlockouts: false, activityBlockouts, vendorBlockouts });
  //   } catch (error) {
  //     throw error;
  //   }
  // },
 
}));

export default useBlockoutStore;
