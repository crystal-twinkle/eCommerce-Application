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
    if (this.slides.length > 1) {
      this.slider.append([this.buttonPrev.getElement(), this.sliderWraper.getElement(), this.buttonNext.getElement()]);
    } else {
      this.slider.append([this.sliderWraper.getElement()]);
    }
  }

  private setContent() {
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
    this.contentContainer.setStyleClass('slider__content-container next');

    const transitionEndHandler = () => {
      this.contentContainer.setStyleClass('slider__content-container stop');
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
    this.contentContainer.setStyleClass('slider__content-container prev');

    const transitionEndHandler = () => {
      this.contentContainer.setStyleClass('slider__content-container stop');
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

    const sliderBlur = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__blur slider__blur_hide',
    });

    const closeButton = new Button({
      callback: () => {
        sliderBlur.setStyleClass('slider__blur slider__blur_hide');
        setTimeout(() => {
          sliderBlur.getElement().remove();
          enableScroll();
        }, 500);
        this.slider.getElement().classList.remove('slider_pop-up');
        this.contentContainer.getElement().addEventListener('click', this.openModal);
      },

      type: ButtonType.CIRCLE,
      icon: { name: 'cross', position: ButtonIconPosition.RIGHT },
      size: ButtonSize.SMALL,
    });

    closeButton.getElement().classList.add('modal-close-button');

    sliderBlur.append([closeButton.getElement()]);
    document.body.append(sliderBlur.getElement());
    setTimeout(() => {
      sliderBlur.setStyleClass('slider__blur');
    });
  };

  public getElement(): HTMLElement {
    return this.slider.getElement();
  }
}
