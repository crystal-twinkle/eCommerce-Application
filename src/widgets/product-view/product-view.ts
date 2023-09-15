import './product-view.scss';
import { Price, Product } from '@commercetools/platform-sdk';
import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';
import PageTitle from '../../features/page-title/page-title';
import Button from '../../shared/ui/button/button';
import { ButtonSize, ButtonType, ButtonIconPosition } from '../../shared/ui/button/models';
import Slider from '../../features/slider/slider';
import CartApi from '../../entities/cart/cart-api';
import ProductApi from '../../entities/product/api';
import getPrice from '../../shared/lib/getPrice';
import store from '../../app/store';

export default class ProductView extends ViewBuilder {
  private slider: Slider;
  private id: string;
  private data: Product;
  private price: Price;
  buttonContainer: ElementBuilder;
  toCartButton: Button;
  removeButton: Button;

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

  private setButtons(): void {
    if (!localStorage.getItem('cartID') || !store.cart.lineItems.find((item) => item.productId === this.id)) {
      this.buttonContainer.prepend([this.toCartButton.getElement()]);
    } else {
      this.buttonContainer.prepend([this.removeButton.getElement()]);
    }
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

    this.price = this.data.masterData.current.masterVariant.prices[0];
    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price',
      content: `${getPrice(this.price)}`,
    });
    priceContainer.append([price.getElement()]);

    this.buttonContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__buttons',
    });

    this.toCartButton = new Button({
      callback: async () => {
        await CartApi.addItemToCart(this.id);
        this.toCartButton.getElement().remove();
        this.setButtons();
      },
      type: ButtonType.DEFAULT,
      text: 'Add to cart',
      icon: {
        name: 'cart',
        position: ButtonIconPosition.RIGHT,
      },
    });

    this.removeButton = new Button({
      callback: async () => {
        await CartApi.removeItemFromCart(this.data.id);
        this.removeButton.getElement().remove();
        this.setButtons();
      },
      type: ButtonType.DEFAULT,
      text: 'Remove from cart',
      icon: {
        name: 'remove',
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

    const plusButton = new Button({
      callback: async () => {
        CartApi.changeQuantity(this.id, 'increase');
      },
      type: ButtonType.CIRCLE,
      size: ButtonSize.SMALL,
      text: '+',
    });

    const minusButton = new Button({
      callback: async () => {
        CartApi.changeQuantity(this.id, 'decrease');
      },
      type: ButtonType.CIRCLE,
      size: ButtonSize.SMALL,
      text: '-',
    });

    const emptyButton = new Button({
      callback: async () => {
        CartApi.clearCart();
      },
      type: ButtonType.DEFAULT,
      size: ButtonSize.SMALL,
      text: 'Clear Cart',
    });

    this.buttonContainer.append([
      likeButton.getElement(),
      plusButton.getElement(),
      minusButton.getElement(),
      emptyButton.getElement(),
    ]);

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

    details.append([priceContainer.getElement(), this.buttonContainer.getElement(), descriptionContainer.getElement()]);

    if (this.price.discounted) {
      const descountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price',
        content: `${getPrice(this.price, true)}`,
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
      this.setButtons();
    });
  }
}
