import './product-view.scss';
import { ClientResponse, Product } from '@commercetools/platform-sdk';
import ElementBuilder from '../shared/lib/element-builder';
import ViewBuilder from '../shared/lib/view-builder';
import PageTitle from '../features/page-title/page-title';
import Slider from '../features/slider/slider';
import flowFactory from '../app/api-flow/flow-factory';

export default class ProductView extends ViewBuilder {
  slides: HTMLElement[];
  slider: Slider;

  // constructor(private id: string) {
  constructor() {
    super('product-view');
  }

  public configureView() {
    this.getProductData().then((productData) => {
      const productName = productData.body.masterData.current.name;
    });
    const pageTitle = new PageTitle('Title');

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

    const content = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__content',
    });

    this.createSlides().then((slides) => {
      this.slides = slides as HTMLElement[];
      this.slider = new Slider(this.slides);
      content.append([this.slider.getElement(), details.getElement()]);
    });

    return [pageTitle.getElement(), content.getElement()];
  }

  private async createSlides() {
    const images = (await this.getProductData()).body.masterData.staged.masterVariant.images;
    const slides: HTMLElement[] = [];

    images.forEach((image) => {
      const slide = new ElementBuilder({
        tag: 'div',
        styleClass: 'slider__slide',
      });

      const slideImage = new Image();
      slideImage.src = image.url;
      slideImage.alt = '';
      slide.append([slideImage]);
      slides.push(slide.getElement());
    });

    return slides;
  }

  private async getProductData(): Promise<ClientResponse<Product>> {
    const productData: ClientResponse<Product> = await flowFactory.refreshTokenFlow
      .products()
      .withId({ ID: 'd991cc27-ea91-4950-a175-94683d20c623' })
      .get()
      .execute();
    console.log(productData);
    return productData;
  }
}
