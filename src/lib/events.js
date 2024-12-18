import { $, noop } from "./utils";
import { renderModal, renderNewCategory } from "./render";
import useStore from "./store";
import { fetchRefData } from "./assets";
import { highlightUpDown, highlightSidways, centerPartialTile } from "./tile-navigation";
import { tmplContainerSkeleton } from "./templates";

export const navControl = (e) => {  
  const { bannerActive, setKeyActive } = useStore.getState();
  setKeyActive(true);
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      highlightUpDown(1);
      break;
    case "ArrowUp":
      if (bannerActive) {
        return;
      }
      e.preventDefault();
      highlightUpDown(-1);
      break;
    case "ArrowLeft":
      if (bannerActive) {
        carousel.nextSlide(1, true);
        return;
      }
      e.preventDefault();
      highlightSidways(-1);
      break;
    case "ArrowRight":
      if (bannerActive) {
        carousel.nextSlide(-1, true);
        return;
      }
      e.preventDefault();
      highlightSidways(1);
      break;
    case "Escape":
    case "Backspace":
      if (bannerActive) {
        return;
      }
      e.preventDefault();
      hideModal();
      break;
    case "Enter":
      !bannerActive && e.preventDefault();
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

export const updateSelectedItem = () => {
  const { activeCategoryIndex, activeItemIndex } = useStore.getState();
  if (activeCategoryIndex < 0) {
    document.activeElement?.blur();
    $("#banner .carousel-track")?.classList.add("active");
    $("#banner .is-active")?.focus();
    return;
  }
  $("#banner .carousel-track")?.classList.remove("active");
  const selector = `.slider[data-index="${activeCategoryIndex}"] a[data-index="${activeItemIndex}"]`;
  $(selector)?.focus();
  centerPartialTile()
};

export const selectTile = () => {
  const { items, setModalActive } = useStore.getState();
  setModalActive(true);
  const { id } = document.activeElement?.dataset;
  document.activeElement.blur();
  renderModal(items[id]);
};

const hideModal = () => {
  const { setModalActive } = useStore.getState();
  setModalActive(false);
  $("#modal").classList.remove("visible");
};

export const clearModal = () => {
  const { modalActive } = useStore.getState();
  if (!modalActive) {
    const $modal = $("#modal");
    $modal.classList.remove("active");
    $modal.innerHTML = "";
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

export const scrollObserver = async (target, callback = noop) => {
  const $lastRow = $(target);
  const { refIndex, refs } = useStore.getState();
  const observer = new IntersectionObserver(async (entries, observer) => {
    for (const entry of entries) {
      await checkIntersectingEntry(refIndex, refs, callback, observer, target)(entry);
    }
  }, {
    threshold: 1
  });

  if ($lastRow) {
    observer.observe($lastRow);
  }
  return Promise.resolve();
};

export const fetchAndAddNewCategories = async () => {
  const { refIndex, refs, sets, loading, nextRefIndex, setLoading } = useStore.getState();
  if (loading) {
    return;
  }
  const $page = $(".page");
  if (refIndex === refs.length) {
    return;
  }
  const $skeleton = document.createElement("div");
  $skeleton.setAttribute("class", "category");
  $skeleton.setAttribute("id", "skeleton");
  nextRefIndex();
  const index = sets.length + refIndex;
  $skeleton.innerHTML = tmplContainerSkeleton(index);
  setLoading(true);
  $page.appendChild($skeleton);
  await fetchRefData(refs[refIndex], renderNewCategory(index));
};
