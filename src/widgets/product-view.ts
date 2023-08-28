import './product-view.scss';
import ElementBuilder from '../shared/lib/element-builder';
import ViewBuilder from '../shared/lib/view-builder';
import PageTitle from '../features/page-title/page-title';
import Slider from '../features/slider/slider';
import flowFactory from '../app/api-flow/flow-factory';

export default class ProductView extends ViewBuilder {
  constructor() {
    super('product-view');
  }
  public configureView(): HTMLElement[] {
    const pageTitle = new PageTitle('Title');

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

    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price',
      content: '$50',
    });

    // const sizes = new ElementBuilder({
    //   tag: 'div',
    //   styleClass: 'product-view__sizes',
    //   content: '$50',
    // });

    // const sizes = new ElementBuilder({
    //   tag: 'div',
    //   styleClass: 'product-view__sizes',
    // });

    const details = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__details',
    });

    details.append([price.getElement()]);
    const slider = new Slider(slides);

    const content = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__content',
    });

    content.append([slider.getElement(), details.getElement()]);

    // console.log(flowFactory.refreshTokenFlow.products().get().execute());

    // flowFactory.refreshTokenFlow.products().withId().get().execute();

    return [pageTitle.getElement(), content.getElement()];
  }
}
