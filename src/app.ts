import useStore from './lib/store';
import { registerHelpersAndPartials, renderContainers, renderBanner } from './lib/render';
import { Carousel } from "./lib/carousel";

const init = async () => {
  registerHelpersAndPartials();
  await useStore.getState().fetchContainers();
  const state = useStore.getState();
  renderBanner(state.collections);
  renderContainers(state);
  window["carousel"] = new Carousel({
    width: 1080,
    speed: 750,
    interval: 6000,
    autoplay: false,
  });
};

document.addEventListener("DOMContentLoaded", init);
