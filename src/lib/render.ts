import Handlebars from "handlebars";
import { Container, StoreState } from "./types";
import { $, $$, bindEvent, compileTemplate, getItemId, getItemImage, getItemTitle } from "./utils";
import "../styles.scss";
import { navControl, selectTile, updateSelectedItem } from "./events";
import useStore from "./store";

export const renderContainers = (state: StoreState) => {
  const containerElement = $("#tmpl-containers");
  if (!containerElement) return;

  $("#root").innerHTML += compileTemplate(containerElement, state);
  bindEvent({ element: document.body, event: "keydown", handler: navControl });
  bindEvent({ element: $$("a.item-tile"), event: "click", handler: selectTile });
  updateSelectedItem(useStore.getState());
};

export const registerHelpersAndPartials = () => {
  Handlebars.registerPartial('tile', $('#tmpl-tile').innerHTML);
  Handlebars.registerPartial('container', $('#tmpl-container').innerHTML);
  Handlebars.registerHelper("getItemId", getItemId);  
  Handlebars.registerHelper("getItemTitle", getItemTitle);
  Handlebars.registerHelper("getItemImage", getItemImage);  
};
