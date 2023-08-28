import ViewBuilder from '../shared/lib/view-builder';
import ElementBuilder from '../shared/lib/element-builder';
import Slider from '../features/slider/slider';

export default class ProductPage extends ViewBuilder {
  constructor() {
    super('page product-page');
  }

  public configureView(): HTMLElement[] {
    const slide1 = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__slide',
      content: '<img src="../../assets/images/dress_1.png">',
    });
    const slide2 = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__slide',
      content: '<img src="../../assets/images/dress_2.png">',
    });
    const slide3 = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__slide',
      content: '<img src="../../assets/images/dress_3.png">',
    });
    const slide4 = new ElementBuilder({
      tag: 'div',
      styleClass: 'slider__slide',
      content: '<img src="../../assets/images/dress_4.png">',
    });

    const slides: HTMLElement[] = [];
    slides.push(slide1.getElement(), slide2.getElement(), slide3.getElement(), slide4.getElement());

    const slider = new Slider(slides);

    return [slider.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
