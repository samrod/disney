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
  containers: Container[];
  loading: boolean;
  error: string | null;

  fetchContainers: () => Promise<void>;
}

