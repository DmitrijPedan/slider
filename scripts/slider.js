export default  class CdSlider {

  options = {
    autoInit: false,
    enableAutoplay: true,
    enableLoop: true,
    interval: 5000,
    slideClassName: 'cd-slide',
    pointClassName: 'cd-point',
    activePointClassname: 'active-point',
    nextClassName: 'cd-next',
    prevClassName: 'cd-prev',
  }

  points = [];
  currentSlide = 1;
  timer = null;
  errors = [];

  constructor(sliderSelector, options) {
    if (!sliderSelector) {
      this.addError('required parameter not specified!');
      return;
    }
    this.slider = document.querySelector(sliderSelector);
    this.options = {...this.options, ...options};
    if (!this.slider) {
      this.addError('failed to get slider by selector!');
      return;
    }
    window.addEventListener('load', () => {
      if (this.options.autoInit) {
        this.init();
      }
    });
  }

  init() {
    if (this.errors.length) {
      this.errors.forEach(error => console.error(error));
      return;
    }
    this.getElementsFromDOM();
    this.setActiveSlide();
    this.showControls();
    this.setActivePoint();
    this.addEventListeners();
    this.setAutoPlay();
  }

  addError(errorText) {
    this.errors.push('cd-slider: ' + errorText);
  }

  getElementsFromDOM() {
    this.pointsContainer = this.slider.querySelector('.cd-points');
    this.slides = [...this.slider.getElementsByClassName(this.options.slideClassName)];
    this.nextButton = this.slider.querySelector('.' + this.options.nextClassName);
    this.prevButton = this.slider.querySelector('.' + this.options.prevClassName);
  }

  setActiveSlide() {
    if (this.slides.length) {
      this.slides.forEach((slide, i) => slide.style.display = (i + 1) === this.currentSlide ? 'flex' : 'none');
    }
  }

  setActivePoint() {
    if (this.points.length) {
      this.points.forEach((point, i) => point.classList.toggle(this.options.activePointClassname, (i + 1) === this.currentSlide));
    }
  }

  addEventListeners () {
    if (this.errors.length) {
      return;
    }
    this.nextButton.addEventListener('click', () => this.next());
    this.prevButton.addEventListener('click', () => this.prev());
    this.slider.addEventListener("touchstart", (event) => this.handleStart(event), false);
    this.slider.addEventListener("touchend", (event) => this.handleEnd(event), false);
  }

  handleStart(event) {
    this.touchStartCoord = event.changedTouches[0].clientX;
  }

  handleEnd(event) {
    this.touchEndCoord = event.changedTouches[event.changedTouches.length - 1].clientX;
    if (this.touchEndCoord > this.touchStartCoord) {
      this.prev();
    } else if (this.touchEndCoord < this.touchStartCoord) {
      this.next();
    }
  }

  goToSlide(number) {
    this.currentSlide = number;
    this.restartInterval();
    this.setActiveSlide();
    this.setActivePoint();
  }

  next() {
    if (!this.options.enableLoop && this.currentSlide === this.slides.length) {
      return;
    }
    const next = this.currentSlide < this.slides.length ? this.currentSlide + 1 : 1;
    this.restartInterval();
    this.goToSlide(next);
  }

  prev() {
    if (!this.options.enableLoop && this.currentSlide === 1) {
      return;
    }
    const prev = this.currentSlide === 1 ? this.slides.length : this.currentSlide - 1;
    this.restartInterval();
    this.goToSlide(prev);
  }

  showControls() {
    if (this.slides.length > 1 && this.pointsContainer) {
      this.prevButton.classList.add('visible-arrow');
      this.nextButton.classList.add('visible-arrow');
      this.createSliderPoints();
    }
  }

  createSliderPoints() {
    this.slides.forEach((slide, i) => {
      let point = document.createElement('span');
      point.classList.add(this.options.pointClassName);
      point.title = `Go to slide ${i + 1}`;
      point.setAttribute('data-slide', (i + 1).toString());
      point.addEventListener('click', () => this.goToSlide(i + 1));
      this.points.push(point);
      this.pointsContainer.appendChild(point);
    })
  }

  setAutoPlay() {
    if (this.options.enableAutoplay) {
      this.timer = setInterval(() => this.next(), this.options.interval);
    }
  }

  restartInterval() {
    if (this.timer) {
      clearInterval(this.timer);
      this.setAutoPlay();
    }
  }
}


const slider = new CdSlider('#homePageSlider', {
  enableAutoplay: true,
  enableLoop: true,
});

slider.init();





