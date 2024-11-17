import useStore from "./store";
import { StoreState } from "./types";

export const set = (
  updater: (state: StoreState) => Partial<StoreState>
) => {
  useStore.setState((state) => ({
    ...updater(state),
  }));
};

interface Listener<T> {
  (state: T, prevState: T): void;
}

interface Selector<T> {
  (state: T): any;
}

class Store<T> {
  private state: T;
  private prevState: T;
  private listeners: {
    selector: Selector<T>,
    listener: Listener<T>,
  }[] = [];

  constructor(initialState: T) {
    this.state = initialState;
    this.prevState = initialState;
  }

  getState = (): T => this.state;

  setState = (newState: Partial<T> | ((state: T) => Partial<T>)): void => {
    const nextState = typeof newState === "function"
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
  };

  subscribe = (listener: Listener<T>, selector: Selector<T> = (state) => state): (() => void) => {
    this.listeners.push({ listener, selector });
    return () => {
      this.listeners = this.listeners.filter((l) => l.listener !== listener);
    };
  };
}

export const createStore = <T>(initialState: T) => new Store<T>(initialState);
