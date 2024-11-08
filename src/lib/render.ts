import Handlebars from "handlebars";
import { ContainerSet, StoreState } from "./types";
import { $, $$, bindEvent } from "./utils";
import { clearModal, fetchAndAddNewCategories, navControl, onPauseClick, onPlayClick, scrollObserver, selectTile, updateSelectedItem } from "./events";
import { compileTemplate, getItemId, getItemTitle, getItemImage, formatImageSrc } from "./helpers";
import "/styles/styles.scss";
import { debounce } from "lodash";
import { scrollToGridx, scrollToGridy } from "./tile-navigation";

export const renderContainers = (state: StoreState) => {
  $("#screen").innerHTML += compileTemplate($("#tmpl-containers"), state);
  [
    { element: document.body, event: "keydown", handler: navControl },
    { element: $$("a.item-tile"), event: "click", handler: e => e.preventDefault() },
    { element: $("#modal"), event: "transitionend", handler: clearModal },
    { element: $$(".slider"), event: "scroll", handler: debounce(scrollToGridx, 100) },
    { element: $(".page"), event: "scroll", handler: debounce(scrollToGridy, 50) },
  ].forEach(bindEvent);
  scrollObserver(".category:last-child", fetchAndAddNewCategories);
  updateSelectedItem();
};

export const renderNewCategory = (index: number) => (set: ContainerSet) => {
  const $containerTemplate = $("#tmpl-container");
  const $newCategory = document.createElement("div");
  $newCategory.setAttribute("class", "category");
  $newCategory.innerHTML = compileTemplate($containerTemplate, { set, index });
  $("#skeleton").remove();
  [
    { element: $newCategory.querySelectorAll("a.item-tile"), event: "click", handler: e => e.preventDefault() },
    { element: $newCategory.querySelectorAll(".slider"), event: "scroll", handler: debounce(scrollToGridx, 100) },
  ].forEach(bindEvent);
  $(".page").appendChild($newCategory);
  scrollObserver(".category:last-child", fetchAndAddNewCategories);
};

export const renderModal = (data) => {
  const $modal = $("#modal");
  $modal.innerHTML = compileTemplate($("#tmpl-modal"), data);
  $modal.setAttribute("class", "active");
  setTimeout(() => $modal.setAttribute("class", "active"), 50);
  setTimeout(() => $modal.setAttribute("class", "visible active"), 100);
  [
    { element: $(".button.play"), event: "click", handler: onPlayClick },
    { element: $(".button.pause"), event: "click", handler: onPauseClick },
  ].forEach(bindEvent);
  $(".button.play")?.focus();
};

export const registerHelpersAndPartials = () => {
  Handlebars.registerPartial('tile', $('#tmpl-tile').innerHTML);
  Handlebars.registerPartial('container', $('#tmpl-container').innerHTML);

  Handlebars.registerHelper("getItemId", getItemId);  
  Handlebars.registerHelper("getItemTitle", getItemTitle);
  Handlebars.registerHelper("getItemImage", getItemImage);  
  Handlebars.registerHelper("formatImageSrc", formatImageSrc);
};
