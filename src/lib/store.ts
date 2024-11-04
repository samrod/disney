import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";
import { fetchAndNormalizeData, update } from "./utils";
import { updateSelectedItem } from "./events";
import { consoleLog } from "./logging";
import { config } from "../../config";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  items: {},
  loading: false,
  error: null,
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  trigger: null,

  fetchContainers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchList();
      consoleLog("rawData", response);
      const data = await fetchAndNormalizeData(response);
      consoleLog("fullData", data);
      set({ containers: data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      consoleLog("fetchContainers", `Unable to retrieve data from ${config.API_DOMAIN}`, "error");
    }
  },

  setItem: (id, data) => update(set, (state) => {
    state.items[id] = data;
  }),

  setActiveItemIndex: (index: number) => update(set, (state) => {
    state.activeItemIndex = index;
  }),

  setActiveCategoryIndex: (index: number) => update(set, (state) => {
    state.activeCategoryIndex = index;
  }),
}));

useStore.subscribe((state, preState) => {
  updateSelectedItem(state, preState);
});

export default useStore;
