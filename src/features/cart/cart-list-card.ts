import { LineItem, Price } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import './cart.scss';

export default class CartListCard extends CommonBuilderWrapper {
  price: Price;

  constructor(private data: LineItem) {
    super();

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
    const priceContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-view__price-container',
    });
    const price = new ElementBuilder({
      tag: 'div',
      styleClass: 'product-list-card__price',
      content: `${this.getPrice(data.variant.prices[0])}`,
    });
    priceContainer.append([price.getElement()]);

    const description = new ElementBuilder({
      tag: 'span',
      styleClass: 'product-list-card__description',
      content: data.name?.['en-US'],
    });
    this.builder.append([img.getElement(), description.getElement()]);
  }

  private getPrice(price: Price, isDiscounted = false): string {
    let centAmount: number = price.value.centAmount;

    if (isDiscounted) {
      centAmount = price.discounted.value.centAmount;
    }

    const fractionDigits: number = price.value.fractionDigits;
    const currencyCode: string = price.value.currencyCode;
    const shortPrice: number = centAmount / 10 ** fractionDigits;
    return new Intl.NumberFormat(`us-US`, {
      style: 'currency',
      currency: `${currencyCode}`,
    }).format(shortPrice);
  }
}
