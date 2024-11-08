import useStore from './lib/store';
import { registerHelpersAndPartials, renderContainers, renderBanner } from './lib/render';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const init = async () => {
  registerHelpersAndPartials();
  await useStore.getState().fetchContainers();
  const state = useStore.getState();
  renderBanner(state.collections);
  renderContainers(state);
  new Splide( "#banner", {
    type: "loop",
    interval: 5000,
    speed: 750,
    width: 1080,
    arrows: false,
    keyboard: true,
    autoplay: true,
    wheel: false,
    slideFocus: true,
  }
   ).mount();
};

document.addEventListener("DOMContentLoaded", init);
