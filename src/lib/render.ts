import Handlebars from "handlebars";
import { StoreState } from "./types";
import { $, $$, bindEvent } from "./utils";
import "/styles/styles.scss";
import { clearModal, navControl, onPauseClick, onPlayClick, selectTile, updateSelectedItem } from "./events";
import useStore from "./store";
import { compileTemplate, getItemId, getItemTitle, getItemImage, formatImageSrc } from "./helpers";
import { bind } from "lodash";

export const renderContainers = (state: StoreState) => {
  $("#screen").innerHTML += compileTemplate($("#tmpl-containers"), state);
  [
    { element: document.body, event: "keydown", handler: navControl },
    { element: $$("a.item-tile"), event: "click", handler: selectTile },
    { element: $("#modal"), event: "transitionend", handler: clearModal },
  ].forEach(bindEvent);
  updateSelectedItem();
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
