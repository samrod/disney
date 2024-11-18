import useStore from "./store";

export const set = (updater) => {
  useStore.setState((state) => ({
    ...updater(state),
  }));
};

class Store {
  constructor(initialState) {
    this.state = initialState;
    this.prevState = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    const nextState =
      typeof newState === "function"
        ? { ...this.state, ...newState(this.state) }
        : { ...this.state, ...newState };
    const prevState = this.state;
    this.state = nextState;

    this.listeners.forEach(({ selector, listener }) => {
      const selectedState = selector(nextState);
      const prevSelectedState = selector(prevState);
      if (JSON.stringify(selectedState) !== JSON.stringify(prevSelectedState)) {
        listener(selectedState, prevSelectedState);
      }
    });
  }

  subscribe(listener, selector = (state) => state) {
    this.listeners.push({ listener, selector });
    return () => {
      this.listeners = this.listeners.filter((l) => l.listener !== listener);
    };
  }
}

export const createStore = (initialState) => new Store(initialState);
