import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";
import { update } from "./utils";
import { fetchAndNormalizeData } from "./assets";
import { updateSelectedItem } from "./events";
import { consoleLog, objDiff } from "./logging";
import { config } from "../../config";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  items: {},
  loading: false,
  error: null,
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  modalActive: false,
  trigger: null,

  fetchContainers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchList();
      consoleLog("rawData", response);
      const data = await fetchAndNormalizeData(response);
      consoleLog("fullData", data);
      set({ containers: data, loading: false, trigger: "fetchContainers" });
    } catch (error) {
      set({ loading: false, error: error.message, trigger: "fetchContainers" });
      consoleLog("fetchContainers", `Unable to retrieve data from ${config.API_DOMAIN}`, "error");
    }
  },

  setItem: (id, data) => update(set, (state) => {
    state.items[id] = data;
    state.trigger = "setItem";
  }),

  setActiveItemIndex: (index) => update(set, (state) => {
    state.activeItemIndex = index;
    state.trigger = "setActiveItemIndex";
  }),

  setActiveCategoryIndex: (index) => update(set, (state) => {
    state.activeCategoryIndex = index;
    state.trigger = "setActiveCategoryIndex";
  }),

  setModalActive: (active) => update(set, (state) => {
    state.modalActive = active;
    state.trigger = "setModalActive";
  }),
}));

useStore.subscribe(({ trigger, ...state }, { trigger: preTrigger, ...preState }) => {
  updateSelectedItem();
  // const diff = objDiff(preState, state);
  // if (diff && trigger !== "setItem") {
  //   consoleLog(trigger, diff, "warn");
  // }
});

export default useStore;
