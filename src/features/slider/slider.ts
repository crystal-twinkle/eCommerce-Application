import './slider.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';
import disableScroll from '../../shared/lib/disable-scroll';
import enableScroll from '../../shared/lib/enable-scroll';

export default class Slider {
  private slider: ElementBuilder;
  private contentContainer: ElementBuilder;
  private sliderWraper: ElementBuilder;
  private buttonNext: ElementBuilder;
  private buttonPrev: ElementBuilder;
  private sliderBlur: ElementBuilder;
  private slides: HTMLElement[];
  private index: number;

  constructor(slides: HTMLElement[]) {
    this.slides = slides;
    this.index = 0;

    this.slider = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider',
    });

    this.sliderWraper = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__wrapper',
    });

    this.contentContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__content-container',
      event: {
        type: 'click',
        callback: this.openModal,
      },
    });

    this.buttonPrev = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__button slider__button_prev',
      event: {
        type: 'click',
        callback: this.prevSlide,
      },
    });

    this.buttonNext = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__button slider__button_next',
      event: {
        type: 'click',
        callback: this.nextSlide,
      },
    });

    this.buildSlider();
    this.setContent();
  }

  private buildSlider(): void {
    this.sliderWraper.append([this.contentContainer.getElement()]);
    this.slider.append([this.buttonPrev.getElement(), this.sliderWraper.getElement(), this.buttonNext.getElement()]);
    if (this.slides.length === 1) {
      this.buttonNext.getElement().classList.add('slider__button_hide');
      this.buttonPrev.getElement().classList.add('slider__button_hide');
    }
  }

  private setContent(): void {
    this.contentContainer.append([this.slides[this.index]]);
  }

  private nextSlide = (): void => {
    this.buttonNext.getElement().removeEventListener('click', this.nextSlide);
    this.buttonPrev.getElement().removeEventListener('click', this.prevSlide);

    if (this.index === this.slides.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }

    this.setContent();
    this.contentContainer.getElement().classList.remove('stop');
    this.contentContainer.getElement().classList.add('next');

    const transitionEndHandler = () => {
      this.contentContainer.getElement().classList.remove('next');
      this.contentContainer.getElement().classList.add('stop');
      this.contentContainer.getElement().firstChild.remove();
      this.contentContainer.getElement().removeEventListener('transitionend', transitionEndHandler);

      this.buttonNext.getElement().addEventListener('click', this.nextSlide);
      this.buttonPrev.getElement().addEventListener('click', this.prevSlide);
    };

    this.contentContainer.getElement().addEventListener('transitionend', transitionEndHandler);
  };

  private prevSlide = (): void => {
    this.buttonNext.getElement().removeEventListener('click', this.nextSlide);
    this.buttonPrev.getElement().removeEventListener('click', this.prevSlide);

    if (this.index === 0) {
      this.index = this.slides.length - 1;
    } else {
      this.index -= 1;
    }

    this.contentContainer.prepend([this.slides[this.index]]);
    this.contentContainer.getElement().classList.remove('stop');
    this.contentContainer.getElement().classList.add('prev');

    const transitionEndHandler = () => {
      this.contentContainer.getElement().classList.remove('prev');
      this.contentContainer.getElement().classList.add('stop');
      this.contentContainer.getElement().lastChild.remove();
      this.contentContainer.getElement().removeEventListener('transitionend', transitionEndHandler);

      this.buttonNext.getElement().addEventListener('click', this.nextSlide);
      this.buttonPrev.getElement().addEventListener('click', this.prevSlide);
    };

    this.contentContainer.getElement().addEventListener('transitionend', transitionEndHandler);
  };

  private openModal = (): void => {
    this.contentContainer.getElement().removeEventListener('click', this.openModal);

    disableScroll();

    this.slider.getElement().classList.add('slider_pop-up');
    this.contentContainer.getElement().classList.add('slider__content-container_pop-up');
    this.slides.forEach((slide) => {
      slide.classList.add('slider__slide_pop-up');
    });

    this.sliderBlur = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__blur slider__blur_hide',
    });

    const closeButton = new Button({
      callback: this.closeModal,
      type: ButtonType.CIRCLE,
      icon: { name: 'cross', position: ButtonIconPosition.RIGHT },
      size: ButtonSize.SMALL,
    });

    closeButton.getElement().classList.add('modal-close-button');

    this.sliderBlur.append([closeButton.getElement()]);
    document.body.append(this.sliderBlur.getElement());
    setTimeout(() => {
      this.sliderBlur.setStyleClass('slider__blur');
    });
  };

  private closeModal = (): void => {
    this.sliderBlur.setStyleClass('slider__blur slider__blur_hide');

    setTimeout(() => {
      this.sliderBlur.getElement().remove();
      enableScroll();
    }, 500);

    this.slider.getElement().classList.remove('slider_pop-up');
    this.contentContainer.getElement().classList.remove('slider__content-container_pop-up');
    this.contentContainer.getElement().firstElementChild.classList.remove('slider__slide_pop-up');

    this.slides.forEach((slide) => {
      slide.classList.remove('slider__slide_pop-up');
    });

    this.contentContainer.getElement().addEventListener('click', this.openModal);
    this.contentContainer.getElement().classList.remove('stop');
  };

  public getElement(): HTMLElement {
    return this.slider.getElement();
  }
}
