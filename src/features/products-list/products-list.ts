import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-list.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Loader from '../../shared/ui/loader/loader';
import ProductListCard from '../product-list-card/product-list-card';
import EmptyView from '../../shared/ui/empty-view/empty-view';

export default class ProductsList extends CommonBuilderWrapper {
  private productCards: HTMLElement[];
  private loader: Loader;
  private emptyView: EmptyView;

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list',
    });
  }

  public setProducts(products: ProductProjection[]): void {
    this.builder.getElement().textContent = '';
    this.productCards = products.map((product: ProductProjection) => new ProductListCard(product).getElement());
    this.builder.append(this.productCards);
  }

  public showLoader(visible: boolean): void {
    this.builder.setContent();

    if (visible) {
      this.builder.append([this.loader.getElement()]);
    } else {
      this.productCards?.length
        ? this.builder.append(this.productCards)
        : this.builder.append([this.emptyView.getElement()]);
    }
  }
}
