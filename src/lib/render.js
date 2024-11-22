import { $, $$, bindEvent, debounce } from "./utils";
import { clearModal, fetchAndAddNewCategories, navControl, onPauseClick, onPlayClick, scrollObserver, updateSelectedItem } from "./events";
import { scrollToGridx, scrollToGridy } from "./tile-navigation";
import { tmplBanner, tmplContainer, tmplContainers, tmplModal } from "./templates";
import useStore from "./store";
import { Carousel } from "./carousel";
import "/styles/styles.css";

export const renderBanner = () => {
  const { collections } = useStore.getState();
  if (!collections) {
    return;
  }
  const { items } = collections;
  const $banner = $("#banner");
  if (!$banner) {
    return;
  }
  $("#banner").innerHTML = tmplBanner(items);
  window["carousel"] = new Carousel({
    width: 1080,
    speed: 750,
    interval: 6000,
    autoplay: true,
  });
};

export const renderContainers = () => {
  const state = useStore.getState();
  const { setKeyActive } = state;
  const $screen = $("#screen");
  if (!$screen) {
    return;
  }
  $("#screen").innerHTML += tmplContainers(state);
  [
    { element: document.body, event: "keydown", handler: navControl },
    { element: document.body, event: "keyup", handler: setKeyActive },
    { element: $$("a.item-tile"), event: "click", handler: e => e.preventDefault() },
    { element: $("#modal"), event: "transitionend", handler: clearModal },
    { element: $$(".slider"), event: "scroll", handler: debounce(scrollToGridx, 100) },
    { element: $(".page"), event: "scroll", handler: debounce(scrollToGridy, 50) },
  ].forEach(bindEvent);
  scrollObserver(".category:last-child", fetchAndAddNewCategories);
  updateSelectedItem();
  fetchAndAddNewCategories()
};

export const renderNewCategory = (index) => async (set) => {
  if (!set) {
    return;
  }
  const $newCategory = document.createElement('div');
  const { bumpTotalCategories, setLoading } = useStore.getState();
  $newCategory.innerHTML = tmplContainer(set, index);
  $("#skeleton").remove();
  [
    { element: $newCategory.querySelectorAll("a.item-tile"), event: "click", handler: e => e.preventDefault() },
    { element: $newCategory.querySelectorAll(".slider"), event: "scroll", handler: debounce(scrollToGridx, 100) },
  ].forEach(bindEvent);
  $(".page").appendChild($newCategory.firstElementChild);
  await scrollObserver(".category:last-child", fetchAndAddNewCategories);
  bumpTotalCategories();
  setLoading(false);
  await fetchAndAddNewCategories();
};

export const renderModal = (data) => {
  const $modal = $("#modal");
  $modal.innerHTML = tmplModal(data);
  $modal.setAttribute("class", "active");
  setTimeout(() => $modal.setAttribute("class", "active"), 50);
  setTimeout(() => $modal.setAttribute("class", "visible active"), 100);
  [
    { element: $(".button.play"), event: "click", handler: onPlayClick },
    { element: $(".button.pause"), event: "click", handler: onPauseClick },
  ].forEach(bindEvent);
  $(".button.play")?.focus();
};
