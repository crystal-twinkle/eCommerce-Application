import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { Price } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';
import './product-list-card.scss';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';

export default class ProductListCard extends CommonBuilderWrapper {
  price: Price;

  constructor(private data: ProductProjection) {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-list-card',
    });

    const img = new ElementBuilder({
      tag: 'img',
      styleClass: 'product-list-card__img',
      tagSettings: {
        src: data.masterVariant.images?.[0]?.url,
        alt: 'Product image',
      },
    });
    const priceContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price-container',
    });
    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-list-card__price',
      content: `${this.getPrice()}`,
    });
    priceContainer.append([price.getElement()]);
    const description = new ElementBuilder({
      tag: 'span',
      styleClass: 'product-list-card__description',
      content: data.name?.['en-US'],
    });
    if (this.price.discounted) {
      const descountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price',
        content: `${this.getPrice(true)}`,
      });

      priceContainer.prepend([descountedPrice.getElement()]);
      descountedPrice.setStyleClass('product-list-card__price product-view__price_discounted');
      price.setStyleClass('product-list-card__price product-view__price_cross-out');
    }
    const likeButton = new Button({
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      size: ButtonSize.SMALL,
      icon: {
        name: 'heart',
        position: ButtonIconPosition.LEFT,
      },
    });
    const toCartButton = new Button({
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      size: ButtonSize.SMALL,
      icon: {
        name: 'cart',
        position: ButtonIconPosition.LEFT,
      },
    });
    const detailsButton = new Button({
      type: ButtonType.DEFAULT,
      text: 'Details',
      callback: () => appRouter.navigate(`${Page.PRODUCTS}/${data.id}`),
    });
    detailsButton.getElement().classList.add('product-list-card__details-button');
    const info = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-list-card__row',
    });
    const infoButtons = new ElementBuilder({
      tag: 'div',
    });
    const details = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-list-card__row',
    });

    infoButtons.append([likeButton.getElement(), toCartButton.getElement()]);
    info.append([infoButtons.getElement(), priceContainer.getElement()]);
    details.append([detailsButton.getElement()]);
    this.builder.prepend([description.getElement()]);
    this.builder.append([img.getElement(), info.getElement(), details.getElement()]);
  }

  private getPrice(isDiscounted = false): string {
    this.price = this.data.masterVariant.prices[0];
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
}
