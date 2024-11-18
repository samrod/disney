import { $, $$, bindEvent } from "./utils";

export class Carousel {
  $slider: HTMLElement | null;
  $firstSlide: HTMLElement | null;
  $lastSlide: HTMLElement | null;
  $slides: HTMLCollection | [];
  $dots: HTMLElement | null;
  interval: number;
  autoplay: boolean;
  previousIndex: number;
  intervalCache: NodeJS.Timeout;
  index: number;
  count: number;
  width: number;
  speed: number;

  constructor(options) {
    Object.assign(this, options);
    this.index = -1;
    this.init();
  }

  init() {
    this.$slider = $(".carousel .carousel-list");
    if (!this.$slider) {
      return;
    }
    this.$slider.addEventListener("transitionend", this.loop.bind(this));
    this.$slides = this.$slider?.children;
    this.count = this.$slides.length;
    this.$firstSlide = this.$slider.firstElementChild as HTMLElement;
    this.$lastSlide = this.$slider.lastElementChild as HTMLElement;

    Array.from(this.$slides).forEach(({ style }) => style.width = `${this.width}px`);
  
    this.$slider.insertBefore(this.$lastSlide.cloneNode(true), this.$firstSlide);
    this.$slider.appendChild(this.$firstSlide.cloneNode(true));
    this.resetTo(-1);
    this.loop();
    this.dots();
    if (this.autoplay) {
      this.play();
    }
  }

  dots() {
    this.$dots = document.createElement("div");
    this.$dots.classList.add("carousel-nav");
    Array.from({ length: this.count }).forEach((_, i) => {
      this.$dots.appendChild(document.createElement("span"));
    });
    $(".carousel").appendChild(this.$dots);
  }

  play() {
    this.intervalCache = setInterval(this.nextSlide.bind(this, -1), this.interval);
  }

  nextSlide(step, uiAction = false) {
    this.previousIndex = this.index;
    this.index += step;
    this.slideTo()
    if (this.autoplay && uiAction) {
      clearInterval(this.intervalCache);
      this.play();
    }
  }

  slideTo() {
    this.$slider.style.transform =`translate3d(${this.index * this.width}px, 0, 0)`;
  }

  loop() {
    this.updateNavClasses();
    if (this.index === -this.count - 1) {
      this.resetTo(-1);
      return;
    }
    if (this.index === 0) {
      this.resetTo(-this.count);
      return;
    }
    this.updateSlideClasses();
  }

  updateSlideClasses() {
    $(".carousel-slide.is-active")?.classList.remove("is-active");
    this.$slides[Math.abs(this.index)]?.classList.add("is-active");
  }

  updateNavClasses() {
    $(".carousel-nav .is-active")?.classList.remove("is-active");
    $(".carousel-nav")?.children[Math.max(0, Math.abs(this.index) - 1)]?.classList.add("is-active");
  }

  resetTo(index) {    
    this.$slider.style.transitionProperty = "none";
    this.index = index;
    this.slideTo();
    setTimeout(() => 
      this.$slider.style.transitionProperty = "transform",
      20
    );
  }
}

