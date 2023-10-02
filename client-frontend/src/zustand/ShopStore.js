import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useShopStore = create((set) => ({
  activities: [],
  setActivities: (newActivities) => set({ activities: newActivities }),
  currentPage: 1,
  setCurrentPage: (newPage) => set({ currentPage: newPage }),
  sortBy: "Newest First",
  setSortBy: (newSortBy) => set({ sortBy: newSortBy }),
  currentActivity: null,
  setCurrentActivity: (newCurrentActivity) =>
    set({ currentActivity: newCurrentActivity }),
  themes: [],
  getThemes: async () => {
    try {
      const response = await AxiosConnect.get("/gleek/shop/getAllThemes");
      set({ themes: response.data.data.slice(1) });
    } catch (error) {
      console.error(error);
    }
  },
  filter: {
    themes: [],
    locations: [],
    sgs: [],
    daysAvailability: [],
    activityType: [],
    duration: [],
    priceRange: [null, null],
  },
  setFilter: (newFilter) => set({ filter: newFilter }),
  getFilteredActivitiesLoading: true,
  setFilteredActivitiesLoading: (newFilteredActivitiesLoading) =>
    set({ filteredActivitiesLoading: newFilteredActivitiesLoading }),
  getFilteredActivities: async (filter, searchValue) => {
    try {
      set({ getFilteredActivitiesLoading: true });
      const response = await AxiosConnect.post(
        "/gleek/shop/getFilteredActivities",
        {
          filter: filter,
          searchValue: searchValue,
        },
      );
      set({ activities: response.data.activities });
      console.log(response.data.activities);
      setTimeout(() => {
        set({ getFilteredActivitiesLoading: false });
      }, 200);
    } catch (error) {
      console.error(error);
    }
  },
  getFilteredActivitiesWithSearchValue: async (filter, searchValue) => {
    try {
      set({ getFilteredActivitiesLoading: true });
      const response = await AxiosConnect.post(
        "/gleek/shop/getFilteredActivities",
        {
          filter: filter,
          searchValue,
        },
      );
      set({ activities: response.data.activities });
      setTimeout(() => {
        set({ getFilteredActivitiesLoading: false });
      }, 200);
    } catch (error) {
      console.error(error);
    }
  },
  searchValue: "",
  setSearchValue: (newSearchValue) => set({ searchValue: newSearchValue }),
  searchValueOnClicked: "",
  setSearchValueOnClicked: (newSearchValueOnClicked) =>
    set({ searchValueOnClicked: newSearchValueOnClicked }),
  getInitialSuggestions: async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/shop/getAllActivitiesNames",
      );
      set({ suggestions: response.data.data });
    } catch (error) {
      console.error(error);
    }
  },
  suggestions: [],
  setSuggestions: (newSuggestions) => set({ suggestions: newSuggestions }),
  minPriceValue: null,
  maxPriceValue: null,
  setMaxPriceValue: (newMaxPriceValue) =>
    set({ maxPriceValue: newMaxPriceValue }),
  setMinPriceValue: (newMinPriceValue) =>
    set({ minPriceValue: newMinPriceValue }),
  getPriceInterval: async () => {
    set({ priceFilterLoading: true });
    try {
      const response = await AxiosConnect.get(
        "/gleek/shop/getMinAndMaxPricePerPax",
      );

      set({ minPriceValue: response.data.minPrice });
      set({ maxPriceValue: response.data.maxPrice });
      setTimeout(() => {
        set({ priceFilterLoading: false });
      }, 200);
    } catch (error) {
      console.error(error);
    }
  },
  priceFilterLoading: true,
  setPriceFilterLoading: (newPriceFilterLoading) =>
    set({ priceFilterLoading: newPriceFilterLoading }),
}));

export default useShopStore;
