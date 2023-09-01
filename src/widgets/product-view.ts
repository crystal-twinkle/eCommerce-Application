import './product-view.scss';
import { Product } from '@commercetools/platform-sdk';
import ElementBuilder from '../shared/lib/element-builder';
import ViewBuilder from '../shared/lib/view-builder';
import PageTitle from '../features/page-title/page-title';
import Slider from '../features/slider/slider';
import ProductApi from '../entities/product-api';

export default class ProductView extends ViewBuilder {
  slides: HTMLElement[];
  slider: Slider;
  id: string;
  data: Product;

  constructor() {
    super('product-view');
  }

  private createSlides() {
    const slides: HTMLElement[] = [];

    const images = this.data.masterData.staged.masterVariant.images;
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
    console.log(images);
    return slides;
  }

  public configureView() {
    console.log(ProductApi.getProducts());
    const pageTitle = new PageTitle(this.data.masterData.current.name['en-US']);
    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price',
      // content: `${this.data.masterData.current.masterVariant.prices[1].value.centAmount}`,
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

    this.slider = new Slider(this.createSlides());
    content.append([this.slider.getElement(), details.getElement()]);
    return [pageTitle.getElement(), content.getElement()];
  }

  public buildView() {
    this.id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
    ProductApi.getProduct(this.id).then((data) => {
      this.data = data;
      this.wrapper.getElement().append(...this.configureView());
      this.view.getElement().append(this.wrapper.getElement());
    });
  }
}
