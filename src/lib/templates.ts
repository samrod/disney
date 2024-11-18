import { formatImageSrc, getItemId, getItemTitle } from "./helpers";
import { ContainerSet } from "./types";

const tmplTile = (item, index: number) => (`
  <a href="#" class="item-tile" data-id="${getItemId(item)}" data-type="tile" data-index="${index}">
    <img src="${formatImageSrc(item?.assets?.tile.id, 200, 'jpeg')}" alt="${getItemTitle(item)}" width="100" height="50" />
  </a>
`);

export const tmplContainer = (set, index: number) => (`
  <div class="category">
    <h4>${getItemTitle(set)}</h4>
    <div class="slider" data-type="slider" data-index="${index}">
      ${set.items.mapJoin(tmplTile)}
    </div>
  </div>
`);

export const tmplContainers = ({ sets, error }) => {
  if (error) {
    return (`
      <div class="page message">
        <h1>Fixing up the Mouse House</h1>
        <h3>We’re bringing you an even smoother streaming experience. Thanks for your patience – your shows will be ready soon!</h3>
      </div>
    `);
  } else {
    return (`
      <div class="page">
          ${sets.mapJoin(tmplContainer)}
      </div>
    `);
  }
};

const tmplBannerSlide = (item: ContainerSet, index: number, root: ContainerSet[]) => (`
  <li class="carousel-slide" data-index="${index}" aria-label="${index} of ${root.length}">
    <div class="banner-image" style="background-image: url(${formatImageSrc(item.assets.banner.id, 1080, 'jpeg')});"></div>
    <img class="banner-logo" width="600" src="${formatImageSrc(item.assets.logo.id, 600, 'png')}" alt="${getItemTitle(item)}" />
  </li>
`);

export const tmplBanner = (items) => (`
  <div class="carousel-track">
    <ul class="carousel-list">
      ${items.mapJoin(tmplBannerSlide)}
    </ul>
  </div>
`);

export const tmplModal = ({ assets, ratings, releases, videoArt }) => (`
  <div class="modal-content">
    <div class="modal-bg" style="background-image: url(${formatImageSrc(assets.background.id, 1200, 'jpeg')})"></div>
    <div class="hero-overlay"></div>
    <div class="logo" style="background-image: url(${formatImageSrc(assets.logo.id, 600, 'png')})"></div>
    <div class="summary">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
    <h4 class="info" data-playing="false">
      ${ratings[0].value && (
        `<div class="rating">${ratings[0].value}</div>`
      ) || ''}
      ${releases[0].releaseYear && (
        `<p>${releases[0].releaseYear}</p>`
      ) || ''}
      ${videoArt[0] && (`
        <div class="actions">
          <button class="playButton play button" autofocus>Play</button>
          <button class="playButton pause button">Pause</button>
        </div>
      `) || ''}
    </h4>
    ${videoArt[0] && (
      `<video class="video" autofocus inline src="${videoArt[0].mediaMetadata.urls[0].url}" />`
    ) || ''}
  </div>
`);

export const tmplContainerSkeleton = (index: number) => (`
  <div class="slider" data-type="slider" data-index="{{index}}"">
    <a href="#" class="item-tile placeholder" data-index="0"></a>
    <a href="#" class="item-tile placeholder" data-index="1"></a>
    <a href="#" class="item-tile placeholder" data-index="2"></a>
    <a href="#" class="item-tile placeholder" data-index="3"></a>
    <a href="#" class="item-tile placeholder" data-index="4"></a>
  </div>
`);
