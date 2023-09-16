import { LineItem, Price } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import getPrice from '../../shared/lib/getPrice';
import './cart.scss';
import CartApi from '../../entities/cart/cart-api';
import Button from '../../shared/ui/button/button';
import { ButtonType, ButtonSize, ButtonIconPosition } from '../../shared/ui/button/models';
import store from '../../app/store';

export default class CartListCard extends CommonBuilderWrapper {
  price: Price;

  constructor(private data: LineItem) {
    super();
    this.price = data.variant.prices[0];

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card',
    });

    const img = new ElementBuilder({
      tag: 'img',
      styleClass: 'cart-list-card__img',
      tagSettings: {
        src: data.variant.images?.[0]?.url,
        alt: 'Product image',
      },
    });
    const details = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__details',
    });

    const priceContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price-container',
    });

    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__price',
      content: `${getPrice(this.price)}`,
    });
    priceContainer.append([price.getElement()]);

    if (this.price.discounted) {
      const descountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price',
        content: `${getPrice(this.price, true)}`,
      });

      priceContainer.prepend([descountedPrice.getElement()]);
      descountedPrice.setStyleClass('product-list-card__price cart-list-card__price product-view__price_discounted');
      price.setStyleClass('product-list-card__price cart-list-card__price  product-view__price_cross-out');
    }

    const heading = new ElementBuilder({
      tag: 'h3',
      styleClass: 'cart-list-card__heading',
      content: data.name?.['en-US'],
    });
    const buttonContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__button-container',
    });

    const quantityControls = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__quantity-controls',
    });

    const itemQuantity = new ElementBuilder({
      tag: 'span',
      content: `${data.quantity}`,
    });

    const plusButton = new Button({
      callback: async () => {
        await CartApi.changeQuantity(data.productId, 'increase');
      },
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      size: ButtonSize.SMALL,
      text: '+',
    });
    plusButton.getElement().classList.add('cart-list__button');

    const minusButton = new Button({
      callback: async () => {
        await CartApi.changeQuantity(data.productId, 'decrease');
      },
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      size: ButtonSize.SMALL,
      text: '—',
    });
    minusButton.getElement().classList.add('cart-list__button');

    const removeButton = new Button({
      callback: async () => {
        await CartApi.removeItemFromCart(data.productId);
      },
      type: ButtonType.DEFAULT,
      text: 'Remove',
      icon: {
        name: 'remove',
        position: ButtonIconPosition.LEFT,
      },
    });
    removeButton.getElement().classList.add('cart-list__button', '_remove');
    buttonContainer.append([quantityControls.getElement(), removeButton.getElement()]);

    const costContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container _card',
      content: `Cost`,
    });

    const cost = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__cost',
      content: `$${(data.totalPrice.centAmount / 100).toFixed(2)}`,
    });
    costContainer.append([cost.getElement()]);
    quantityControls.append([minusButton.getElement(), itemQuantity.getElement(), plusButton.getElement()]);

    details.append([heading.getElement(), priceContainer.getElement(), buttonContainer.getElement()]);
    this.builder.append([img.getElement(), details.getElement(), costContainer.getElement()]);
  }
}
