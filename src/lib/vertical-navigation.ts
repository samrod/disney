import useStore from "./store";
import { $ } from "./utils";

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
  const { activeCategoryIndex } = useStore.getState();
  const $activeRow = $(`.slider[data-index="${activeCategoryIndex}"]`);

  const visibleTiles = getVisibleTiles($activeRow);
  return visibleTiles.indexOf(document.activeElement as HTMLElement);
};

export const absoluteIndexFromVisible = (newCategoryIndex: number): number =>  {
  const visiblePosition = visibleIndexFromActiveTile();
  const $targetRow = $(`.slider[data-index="${newCategoryIndex}"]`);
  const visibleTiles = getVisibleTiles($targetRow);
  const $targetTile = visibleTiles[visiblePosition] || visibleTiles[visibleTiles.length - 1];

  const targetIndex = $targetTile?.dataset.index;
  return Number(targetIndex);
};
