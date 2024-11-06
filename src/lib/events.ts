import { $, $$, restrictToRange } from "./utils";
import { renderModal } from "./render";
import useStore from "./store";

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
    case "Escape":
    case "Backspace":
      e.preventDefault();
      hideModal();
  }
};

const highlightSidways = (step: number) => {
  const { modalActive, activeItemIndex, setActiveItemIndex } = useStore.getState();
  if (modalActive) {
    return;
  }
  const activeItem = document.activeElement;
  const totalItems = Number(activeItem.parentNode?.children.length);
  const newItemIndex = restrictToRange(activeItemIndex + step, totalItems);
  setActiveItemIndex(newItemIndex);
};

const highlightUpDown = (step: number) => {
  const { modalActive, activeCategoryIndex, setActiveCategoryIndex } = useStore.getState();
  if (modalActive) {
    return;
  }
  const totalCategories = $$(".category").length;
  const newCategoryIndex = restrictToRange(activeCategoryIndex + step, totalCategories);
  setActiveCategoryIndex(newCategoryIndex);
}

export const updateSelectedItem = () => {
  const { activeCategoryIndex, activeItemIndex } = useStore.getState();
  const selector = `.slider[data-index="${activeCategoryIndex}"] a[data-index="${activeItemIndex}"]`;
  $(selector)?.focus();    
};

export const selectTile = async (e: MouseEvent) => {
  e.preventDefault();
  const { items, setModalActive } = useStore.getState();
  setModalActive(true);
  const { id } = e.target?.dataset;
  renderModal(items[id]);
  console.log(items[id]);
};

const hideModal = () => {
  const { setModalActive } = useStore.getState();
  setModalActive(false);
  $("#modal").setAttribute("class", "hide");
};

export const clearModal = () => {
  const { modalActive } = useStore.getState();
  if (!modalActive) {
    const $modal = $("#modal");
    $modal.innerHTML = "";
    $modal.setAttribute("class", "");
    updateSelectedItem();
  }
};

export const onPlayClick = (e) => {
  $("#modal .video")?.play();
  $(".info").setAttribute("data-playing", "true");
  $(".video").setAttribute("class", "video playing")
  $(".playButton.pause").focus();
};

export const onPauseClick = (e) => {
  $("#modal .video")?.pause();
  $(".info").setAttribute("data-playing", "false");
  // $(".video").setAttribute("class", "video")
  $(".playButton.play").focus();
};

