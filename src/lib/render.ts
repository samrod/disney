import Handlebars from "handlebars";
import { Container } from "./types";
import { $, bindEvent, compileTemplate, getItemImage, getItemTitle } from "./utils";
import "../styles.scss";
import { navControl, updateSelectedItem } from "./events";
import useStore from "./store";

export const renderContainers = (containers: Container[]) => {
  const containerElement = $("#tmpl-containers");
  if (!containerElement) return;

  $("#root").innerHTML += compileTemplate(containerElement, containers);
  bindEvent({ element: document.body, event: "keydown", handler: navControl });
  updateSelectedItem(useStore.getState());
};

export const registerHelpersAndPartials = () => {
  Handlebars.registerPartial('tile', $('#tmpl-tile').innerHTML);
  Handlebars.registerPartial('container', $('#tmpl-container').innerHTML);
  Handlebars.registerHelper("getItemTitle", getItemTitle);
  Handlebars.registerHelper("getItemImage", getItemImage);  
};
