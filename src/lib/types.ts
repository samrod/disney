export interface Item {
  id: string;
  title: string;
  setId: string;
}

export interface Set {
  id: string;
  name: string;
  items: Item[];
  containerId: string;
}

export interface Container {
  id: string;
  name: string;
  sets: Set[];
}

export interface StoreState {
  items: {};
  containers: Container[];
  loading: boolean;
  error: string | null;
  activeCategoryIndex: number;
  activeItemIndex: number;
  modalActive: boolean;
  trigger: null| string;

  fetchContainers: () => Promise<void>;
  setItem: (id: string, data: {}) => void;
  setActiveItemIndex: (index: number) => void;
  setActiveCategoryIndex: (index: number) => void;
  setModalActive: (state: boolean) => void;
}

