import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";
import { update } from "./utils";
import { fetchAndNormalizeData } from "./assets";
import { updateSelectedItem } from "./events";
import { consoleLog, objDiff } from "./logging";
import { config } from "../../config";
import { absoluteIndexFromVisible } from "./tile-navigation";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  refs: [],
  items: {},
  loading: false,
  error: null,
  videoPlaying: false,
  refIndex: 0,
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  modalActive: false,
  trigger: null,

  fetchContainers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchList();
      // consoleLog("rawData", response);
      const { sets, refs } = await fetchAndNormalizeData(response);
      set({
        sets,
        refs,
        loading: false,
        trigger: "fetchContainers",
      });
      consoleLog("sets, refs", {sets, refs});
    } catch (error) {
      set({ loading: false, error: error.message, trigger: "fetchContainers" });
      consoleLog("fetchContainers", `Unable to retrieve data from ${config.API_DOMAIN}, ${error.message}`, "error");
    }
  },

  setVideoPlaying: (playing) => update(set, (state) => {
    state.videoPlaying = typeof playing !== "undefined" ? playing : !state.videoPlaying;
    state.trigger = "setVideoPlaying";
  }),

  nextRefIndex: () => update(set, (state) => {
    state.refIndex = Number(state.refIndex) + 1;
    state.trigger = "setNextRef";
  }),

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
    state.activeItemIndex = absoluteIndexFromVisible(index);
    state.trigger = "setActiveCategoryIndex";
  }),

  setModalActive: (active) => update(set, (state) => {
    state.modalActive = active;
    state.trigger = "setModalActive";
    if (!active) {
      state.videoPlaying = false;
    }
  }),
}));

let __DEV__;
// __DEV__ = true;
useStore.subscribe(({ trigger, ...state }, { trigger: preTrigger, ...preState }) => {
  updateSelectedItem();
  if (__DEV__) {
    const diff = objDiff(preState, state);
    if (diff && trigger !== "setItem") {
      consoleLog(trigger, diff, "warn");
    }
  }
});

export default useStore;
