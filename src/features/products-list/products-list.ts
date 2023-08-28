import { Product } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-list.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Loader from '../../shared/ui/loader/loader';
import ProductListCard from '../product-list-card/product-list-card';

export default class ProductsList extends CommonBuilderWrapper {
  private productCards: HTMLElement[];
  private loader: Loader;
  private emptyView: HTMLElement;

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new ElementBuilder({
      tag: 'span',
      content: 'Empty',
    }).getElement();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list',
    });
  }

  public setProducts(products: Product[]): void {
    this.productCards = products.map((product: Product) => new ProductListCard(product).getElement());
    this.builder.append(this.productCards);
  }

  public showLoader(visible: boolean): void {
    this.builder.setContent();

    if (visible) {
      this.builder.append([this.loader.getElement()]);
    } else {
      this.productCards?.length ? this.builder.append(this.productCards) : this.builder.append([this.emptyView]);
    }
  }
}
