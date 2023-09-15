import { LineItem, Price } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import getPrice from '../../shared/lib/getPrice';
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
      content: `${getPrice(data.variant.prices[0])}`,
    });
    priceContainer.append([price.getElement()]);

    const description = new ElementBuilder({
      tag: 'span',
      styleClass: 'product-list-card__description',
      content: data.name?.['en-US'],
    });
    this.builder.append([img.getElement(), description.getElement()]);
  }
}
