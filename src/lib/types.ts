export interface Container {
  id: string;
  name: string;
  sets: Set[];
}

interface Meta {
  hits: number;
  offset: number;
  page_size: number;
}

interface TextDefault {
  default: {
    content: string;
    language: string;
    sourceEntity: string;
  }
}

interface Text {
  [key: string]: {
    full: {
      set?: TextDefault;
      series?: TextDefault;
    }
  }
}

interface ImageDefault {
  series: {
    default: {
      masterHeight: number;
      masterWidth: number;
      masterId: string;
      url: string;
    }
  }
}

interface ImageSeries {
  [key: string]: {
    [key: string]: ImageDefault;
  }
}

interface Ratings {
  advisories: unknown[];
  description: string;
  system: string;
  value: string;
}

interface Tags {
  displayName: string;
  type: string;
  value: string;
}

interface Release {
  releaseDate: string;
  releaseType: string;
  reseaseYear: number;
  territory: string;
}

interface VideoArt {
  mediaMetadata: {
    urls: {
      url: string;
    }[];
    purpose: string;
  }

}
export interface Item {
  callToActions: string;
  contentId: string;
  encodedSeriesId: string;
  textExperienceId: string;
  type: string;
  text: Text;
  image: ImageSeries;
  ratings: Ratings[];
  releases: Release[];
  tags: Tags[];
  videoArt: VideoArt[];
  currentAvailability: {
    region: string;
    kidsMode: boolean;
  }
  mediaRights: {
    downloadBlocked: boolean;
    pconBlocked: boolean;
  }
}
export interface ContainerSet {
  contentClass: string;
  items: Item[];
  meta: Meta;
  refId?: string;
  refIdtype?: string;
  refType?: string;
  setId?: string;
  text:  Text;
  type: string;
}

export interface StoreState {
  sets: ContainerSet[],
  refs: ContainerSet[],
  items: { [key: string]: Item };
  containers: Container[];
  loading: boolean;
  error: string | null;
  videoPlaying: boolean;
  refIndex: number;
  activeCategoryIndex: number;
  activeItemIndex: number;
  modalActive: boolean;
  trigger: null| string;

  fetchContainers: () => Promise<void>;
  nextRefIndex: () => void;
  setVideoPlaying: (playing?: boolean) => void;
  setItem: (id: string, item: Item) => void;
  setActiveItemIndex: (index: number) => void;
  setActiveCategoryIndex: (index: number) => void;
  setModalActive: (state: boolean) => void;
}
