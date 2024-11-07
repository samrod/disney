import { $, $$, restrictToRange } from "./utils";
import { renderModal } from "./render";
import useStore from "./store";
import { noop } from "lodash";
import { fetchRefData } from "./assets";
import { compileTemplate } from "./helpers";

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
      break;
    case "Enter":
      e.preventDefault();
      const classList = e.target.classList;
      if (classList.contains("item-tile")) {
        selectTile();
        break;
      }
      if (classList.contains("playButton")) {
        if (useStore.getState().videoPlaying) {
          onPauseClick(e);
        } else {
          onPlayClick(e);
        }
        break;
      }
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
};

export const updateSelectedItem = () => {
  const { activeCategoryIndex, activeItemIndex } = useStore.getState();
  const selector = `.slider[data-index="${activeCategoryIndex}"] a[data-index="${activeItemIndex}"]`;
  $(selector)?.focus();
};

export const selectTile = async () => {
  const { items, setModalActive } = useStore.getState();
  setModalActive(true);
  const { id } = document.activeElement?.dataset;
  renderModal(items[id]);
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
  e.preventDefault();
  useStore.getState().setVideoPlaying(true);
  $("#modal .video")?.play();
  $(".info").setAttribute("data-playing", "true");
  $(".video").setAttribute("class", "video playing")
  $(".playButton.pause").focus();
};

export const onPauseClick = (e) => {
  useStore.getState().setVideoPlaying(false);
  $("#modal .video")?.pause();
  $(".info").setAttribute("data-playing", "false");
  $(".playButton.play").focus();
};

const checkIntersectingEntry = (refIndex, refs, callback, observer, target) => async entry => {
  if (entry.isIntersecting) {
    await callback();
    observer.unobserve(entry.target);
    if (refIndex >= refs.length - 1) {
      return;
    }
    scrollObserver(target, callback);
  }
};

export const scrollObserver = (target: string, callback = noop) => {
  const $lastRow = $(target);
  const { refIndex, refs } = useStore.getState();
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(checkIntersectingEntry(refIndex, refs, callback, observer, target));
  }, {
    threshold: 0.5
  });

  if ($lastRow) {
    observer.observe($lastRow);
  }
};

export const fetchAndAddNewCategories = async () => {
  const { nextRefIndex, refIndex, refs, sets } = useStore.getState();
  const $page = $(".page");

  const $skeleton = document.createElement("div");
  $skeleton.setAttribute("class", "category");
  $skeleton.setAttribute("id", "skeleton");
  nextRefIndex();
  const index = sets.length + refIndex;
  $skeleton.innerHTML = compileTemplate($("#tmpl-container-skeleton"), { index });
  $page.appendChild($skeleton);

  const newRef = await fetchRefData(refs[refIndex], () => $("#skeleton").remove());
  const $containerTemplate = $("#tmpl-container");
  const $newCategory = document.createElement("div");
  $newCategory.setAttribute("class", "category");
  $newCategory.innerHTML = compileTemplate($containerTemplate, { set: newRef.set, index });

  $page.appendChild($newCategory);
};
