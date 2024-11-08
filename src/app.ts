import useStore from './lib/store';
import { registerHelpersAndPartials, renderContainers, renderSlider } from './lib/render';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const init = async () => {
  registerHelpersAndPartials();
  await useStore.getState().fetchContainers();
  const state = useStore.getState();
  renderSlider(state.collections);
  renderContainers(state);
  new Splide( "#slider", {
    type: "loop",
    rate: 3000,
    speed: 750,
    width: 1080,
    arrows: false,
    keyboard: true,
    autoplay: true,
    wheel: false,
  }
   ).mount();
};

document.addEventListener("DOMContentLoaded", init);
