import useStore from './lib/store';
import { registerHelpersAndPartials, renderContainers } from './lib/render';

const init = async () => {
  registerHelpersAndPartials();
  await useStore.getState().fetchContainers();
  const state = useStore.getState();
  renderContainers(state.containers);
};

document.addEventListener("DOMContentLoaded", init);
