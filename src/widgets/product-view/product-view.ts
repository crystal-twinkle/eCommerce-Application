import './product-view.scss';
import { DiscountedPrice, Price, Product } from '@commercetools/platform-sdk';
import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';
import PageTitle from '../../features/page-title/page-title';
import Button from '../../shared/ui/button/button';
import { ButtonSize, ButtonType, ButtonIconPosition } from '../../shared/ui/button/models';
import Slider from '../../features/slider/slider';
import ProductApi from '../../entities/product/api';

export default class ProductView extends ViewBuilder {
  private slider: Slider;
  private id: string;
  private data: Product;
  private price: Price;
  private disountedPrice: DiscountedPrice;

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

    return slides;
  }

  private getPrice(isDiscounted = false): string {
    this.price = this.data.masterData.current.masterVariant.prices[0];
    let centAmount: number = this.price.value.centAmount;

    if (isDiscounted) {
      centAmount = this.price.discounted.value.centAmount;
    }

    const fractionDigits: number = this.price.value.fractionDigits;
    const currencyCode: string = this.price.value.currencyCode;
    const shortPrice: number = centAmount / 10 ** fractionDigits;
    const formatedPrice: string = new Intl.NumberFormat(`us-US`, {
      style: 'currency',
      currency: `${currencyCode}`,
    }).format(shortPrice);

    return formatedPrice;
  }

  public configureView(): HTMLElement[] {
    const pageTitle = new PageTitle(this.data.masterData.current.name['en-US']);
    pageTitle.getElement().classList.add('product-view__title');

    this.slider = new Slider(this.createSlides());

    const sliderWrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__slider-wrapper',
    });
    sliderWrapper.append([this.slider.getElement()]);
    const productViewcontent = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__content',
    });

    const details = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__details',
    });

    const priceContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price-container',
    });

    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price',
      content: `${this.getPrice()}`,
    });
    priceContainer.append([price.getElement()]);

    const buttonContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__buttons',
    });

    const toCartButton = new Button({
      type: ButtonType.DEFAULT,
      text: 'Add to cart',
      icon: {
        name: 'cart',
        position: ButtonIconPosition.RIGHT,
      },
    });

    const likeButton = new Button({
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      size: ButtonSize.SMALL,
      icon: {
        name: 'heart',
        position: ButtonIconPosition.LEFT,
      },
    });

    buttonContainer.append([toCartButton.getElement(), likeButton.getElement()]);

    const descriptionContainer = new ElementBuilder({
      tag: 'div',
    });

    const descriptionHeading = new ElementBuilder({
      tag: 'h3',
      content: 'Description',
    });

    const descritionData = this.data.masterData.current.description['en-US'];
    const descrition = new ElementBuilder({
      tag: 'p',
      content: `${descritionData}`,
      styleClass: 'product-view__description',
    });

    descriptionContainer.append([descriptionHeading.getElement(), descrition.getElement()]);

    details.append([priceContainer.getElement(), buttonContainer.getElement(), descriptionContainer.getElement()]);

    if (this.price.discounted) {
      const descountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price',
        content: `${this.getPrice(true)}`,
      });

      priceContainer.prepend([descountedPrice.getElement()]);
      descountedPrice.setStyleClass('product-view__price product-view__price_discounted');
      price.setStyleClass('product-view__price product-view__price_cross-out');
    }

    productViewcontent.append([sliderWrapper.getElement(), details.getElement()]);
    return [pageTitle.getElement(), productViewcontent.getElement()];
  }

  public buildView() {
    this.id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
    ProductApi.getProduct(this.id).then(async (data) => {
      this.data = data;
      this.wrapper.getElement().append(...this.configureView());
      this.view.getElement().append(this.wrapper.getElement());
    });
  }
}
