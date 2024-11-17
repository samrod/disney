import useStore from './lib/store';
import { renderContainers, renderBanner } from './lib/render';

const init = async () => {
  await useStore.getState().fetchContainers();
  renderBanner();
  renderContainers();
};

document.addEventListener("DOMContentLoaded", init);
