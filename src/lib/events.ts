import { getActiveResourcesInfo } from "process";
import useStore from "./store";
import { StoreState } from "./types";
import { $, $$, restrictToRange } from "./utils";
import { fetchSet } from "./api";

export const navControl = (e: KeyboardEvent) => {  
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      highlightUpDown(1);
      break;
    case "ArrowUp":
      e.preventDefault();
      highlightUpDown(-1);
      break;
    case "ArrowLeft":
      e.preventDefault();
      highlightSidways(-1);
      break;
    case "ArrowRight":
      e.preventDefault();
      highlightSidways(1);
      break;
  }
};

const highlightSidways = (step: number) => {
  const activeItem = document.activeElement;
  const { activeItemIndex, setActiveItemIndex } = useStore.getState();
  const totalItems = Number(activeItem.parentNode?.children.length);
  const newItemIndex = restrictToRange(activeItemIndex + step, totalItems);
  setActiveItemIndex(newItemIndex);
};

const highlightUpDown = (step: number) => {
  const { activeCategoryIndex, setActiveCategoryIndex } = useStore.getState();
  const totalCategories = $$(".category").length;
  const newCategoryIndex = restrictToRange(activeCategoryIndex + step, totalCategories);
  setActiveCategoryIndex(newCategoryIndex);
}

export const updateSelectedItem = ({ activeCategoryIndex, activeItemIndex }: StoreState, preState?: StoreState) => {
  if (!preState) {
    $('.slider[data-index="0"] a[data-index="0"]')?.focus();
    return;
  }
  if (activeItemIndex !== preState.activeItemIndex || activeCategoryIndex !== preState.activeCategoryIndex ) {
    const selector = `.slider[data-index="${activeCategoryIndex}"] a[data-index="${activeItemIndex}"]`;
    $(selector)?.focus();    
  }
};

export const selectTile = async (e: MouseEvent) => {
  e.preventDefault();
  const { id } = e.target?.dataset;
  const { items } = useStore.getState();
  console.log(items[id]);
};
