import { getActiveResourcesInfo } from "process";
import useStore from "./store";
import { StoreState } from "./types";
import { $, $$, restrictToRange } from "./utils";

export const navControl = (e: KeyboardEvent) => {
  e.preventDefault();

  switch (e.key) {
    case "ArrowDown":
      selectRow(1);
      break;
    case "ArrowUp":
      selectRow(-1);
      break;
    case "ArrowLeft":
      selectTile(-1);
      break;
    case "ArrowRight":
      selectTile(1);
      break;
  }
};

const selectTile = (step: number) => {
  const activeItem = document.activeElement;
  const { activeItemIndex, setActiveItemIndex } = useStore.getState();
  const totalItems = Number(activeItem.parentNode?.children.length);
  const newItemIndex = restrictToRange(activeItemIndex + step, totalItems);
  setActiveItemIndex(newItemIndex);
};

const selectRow = (step: number) => {
  const { activeCategoryIndex, setActiveCategoryIndex } = useStore.getState();
  const totalCategories = $$(".category").length;
  const newCategoryIndex = restrictToRange(activeCategoryIndex + step, totalCategories);
  setActiveCategoryIndex(newCategoryIndex);
}

export const updateSelectedItem = ({ activeCategoryIndex, activeItemIndex }: StoreState, preState?: StoreState) => {
  if (!preState) {
    $('.slider[data-index="0"] a[data-index="0"]').focus();
    return;
  }
  if (activeItemIndex !== preState.activeItemIndex || activeCategoryIndex !== preState.activeCategoryIndex ) {
    const selector = `.slider[data-index="${activeCategoryIndex}"] a[data-index="${activeItemIndex}"]`;
    $(selector)?.focus();    
  }
};
