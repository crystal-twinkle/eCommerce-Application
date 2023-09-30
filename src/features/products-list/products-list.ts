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
  private productsList: ElementBuilder;

  constructor() {
    super();
    this.loader = new Loader('products-list-loader');
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list-wrapper',
    });
    this.productsList = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list',
    });
    this.builder.append([this.productsList.getElement(), this.loader.getElement()]);
  }

  public setProducts(products: ProductProjection[]): void {
    this.productsList.setContent();

    if (products.length) {
      this.productCards = products.map((product: ProductProjection) => new ProductListCard(product).getElement());
      this.productsList.append(this.productCards);
    } else {
      this.productsList.append([this.emptyView.getElement()]);
    }
  }

  public showLoader(visible: boolean): void {
    this.loader.visible = visible;
  }
}
