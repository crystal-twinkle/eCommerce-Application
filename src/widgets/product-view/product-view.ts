import './product-view.scss';
import { Cart, Price, Product } from '@commercetools/platform-sdk';
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
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';

export default class ProductView extends ViewBuilder {
  private slider: Slider;
  private id: string;
  private data: Product;
  private price: Price;
  buttonContainer: ElementBuilder;
  toCartButton: Button;
  removeButton: Button;
  public loadingInProgress: boolean;

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

  private setButtons(cart: Cart): void {
    if (cart) {
      const findItems = cart?.lineItems?.find((item) => item.productId === this.data.id);
      if (!findItems) {
        this.buttonContainer.prepend([this.toCartButton.getElement()]);
      } else {
        this.buttonContainer.prepend([this.removeButton.getElement()]);
      }
    } else {
      this.buttonContainer.prepend([this.toCartButton.getElement()]);
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
        if (!this.loadingInProgress) {
          this.loadingInProgress = true;
          CartApi.addItemToCart(this.data.id)
            .then(() => {
              this.loadingInProgress = false;
              this.toCartButton.getElement().remove();
              this.setButtons(store.cart);
            })
            .catch(() => {
              this.loadingInProgress = false;
            });
        }
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
        if (!this.loadingInProgress) {
          this.loadingInProgress = true;
          CartApi.removeItemFromCart(this.data.id)
            .then(() => {
              this.loadingInProgress = false;
              this.removeButton.getElement().remove();
              this.setButtons(store.cart);
            })
            .catch(() => {
              this.loadingInProgress = false;
            });
        }
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

    this.buttonContainer.append([likeButton.getElement()]);

    const descriptionContainer = new ElementBuilder({
      tag: 'div',
    });

    const descriptionHeading = new ElementBuilder({
      tag: 'h3',
      content: 'Description',
    });

    const descriptionData = this.data.masterData.current.description['en-US'];
    const description = new ElementBuilder({
      tag: 'p',
      content: `${descriptionData}`,
      styleClass: 'product-view__description',
    });

    descriptionContainer.append([descriptionHeading.getElement(), description.getElement()]);

    details.append([priceContainer.getElement(), this.buttonContainer.getElement(), descriptionContainer.getElement()]);

    if (this.price.discounted) {
      const discountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price',
        content: `${getPrice(this.price, true)}`,
      });

      priceContainer.prepend([discountedPrice.getElement()]);
      discountedPrice.setStyleClass('product-view__price product-view__price_discounted');
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
      if (store.cart) {
        this.setButtons(store.cart);
      }
      eventBus.subscribe(EventBusActions.UPDATE_CART, (eventData) => this.setButtons(eventData as Cart));
    });
  }
}
