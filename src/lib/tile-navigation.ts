import { $, restrictToRange } from "./utils";
import { consoleLog } from "./logging";
import useStore from "./store";

const MARGIN_WIDTH = 48;
export const centerPartialTile = () => {
  const $activeItem = document.activeElement;
  const $row = $activeItem.parentElement;
  const clientWidth = $activeItem.clientWidth;
  const itemRightEdge = $activeItem?.offsetLeft + clientWidth;
  const rowScrollOffset = $row?.scrollLeft + $row?.clientWidth;
  if (itemRightEdge > rowScrollOffset) {
    const scrollIncriment = (clientWidth + MARGIN_WIDTH) << 1;
    $row?.scrollBy(scrollIncriment, 0);
  }
};

export const highlightSidways = (step: number) => {
  const { modalActive, activeItemIndex, setActiveItemIndex } = useStore.getState();
  if (modalActive) {
    return;
  }
  const activeItem = document.activeElement;
  const slider = activeItem.parentElement;
  const totalItems = Number(slider?.children.length);
  const newItemIndex = restrictToRange(activeItemIndex + step, totalItems - 1);
  setActiveItemIndex(newItemIndex);
};

export const highlightUpDown = (step: number) => {
  const { sets, refs, modalActive, activeCategoryIndex, setActiveCategoryIndex } = useStore.getState();
  if (modalActive) {
    return;
  }
  const totalCategories = (sets as []).length + (refs as []).length;
  const newCategoryIndex = restrictToRange(activeCategoryIndex + step, totalCategories - 1);
  setActiveCategoryIndex(newCategoryIndex);
};

const OFFSET = 100;
const getVisibleTiles = ($row: HTMLElement): HTMLElement[] => {
  if (!$row) {
    return;
  }
  const rowLeftOffset = $row.getBoundingClientRect().left;
  return Array
    .from($row.children)
    .filter((tile: HTMLElement) => {
      const { left, right } = tile.getBoundingClientRect();
      return left >= rowLeftOffset - OFFSET && right <= window.innerWidth + OFFSET;
  }) as HTMLElement[];
};

export const visibleIndexFromActiveTile = (): number => {
  const $activeRow = document.activeElement.parentElement;
  try {
    const visibleTiles = getVisibleTiles($activeRow);
    return visibleTiles.indexOf(document.activeElement as HTMLElement);
  } catch (e) {
    consoleLog("visibleIndexFromActiveTile", e.message, "warn")
  }
};

export const absoluteIndexFromVisible = (newCategoryIndex: number): number =>  {
  const visiblePosition = visibleIndexFromActiveTile();
  const $targetRow = $(`.slider[data-index="${newCategoryIndex}"]`);
  try {
    const visibleTiles = getVisibleTiles($targetRow);
    const $targetTile = visibleTiles[visiblePosition] || visibleTiles[visibleTiles.length - 1];
    const targetIndex = $targetTile?.dataset.index;
    return Number(targetIndex);
  } catch (e) {
    consoleLog("absoluteIndexFromVisible", e.message, "warn")
  }
};

export const scrollToGridx = (e: UIEvent) => {
  const currentScrollLeft = e.target?.scrollLeft;
  const tileWidth = document.activeElement.clientWidth + MARGIN_WIDTH;
  const nearestIncrement = Math.round(currentScrollLeft / tileWidth) * tileWidth;

  e.target?.scrollTo({
    left: nearestIncrement,
    behavior: "smooth"
  });
};

export const scrollToGridy = (e: UIEvent) => {
  const currentScrollTop = e.target?.scrollTop;
  const tileHeight = e.target.children[0].clientHeight;
  const nearestIncrement = Math.round(currentScrollTop / tileHeight) * tileHeight;

  e.target?.scrollTo({
    top: nearestIncrement,
    behavior: "smooth"
  });
};
