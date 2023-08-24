import ViewBuilder from '../../shared/lib/view-builder';
import Title from '../../features/title/title';
import ElementBuilder from '../../shared/lib/element-builder';
import ProductsFilter from '../../features/products-filter/products-filter';
import './products-list-page.scss';
import ProductsList from '../../features/products-list/products-list';
import apiFactory from '../../shared/lib/api-factory/api-factory';
import ProductAPI from '../../entities/product/api';
import { Product } from '../../entities/product/models';
import { ApiNames } from '../../shared/lib/api-factory/api-names';
import ListResponse from '../../entities/models';

export default class ProductsListPage extends ViewBuilder {
  private productsFilter: ProductsFilter;
  private productsList: ProductsList;

  constructor() {
    super('page main-page');
    this.loadProducts();
  }

  public configureView(): HTMLElement[] {
    const titleView = new Title('Блузки и рубашки для женщин');
    this.productsList = new ProductsList();
    this.productsFilter = new ProductsFilter();
    const productsView = new ElementBuilder({
      tag: 'article',
      styleClass: 'products-list-page',
    });
    productsView.append([this.productsFilter.getElement(), this.productsList.getElement()]);

    return [titleView.getElement(), productsView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }

  public loadProducts(): void {
    this.productsList.showLoader(true);
    (apiFactory.getApi(ApiNames.PRODUCTS) as ProductAPI).getProducts().then((data: ListResponse<Product>) => {
      this.productsList.setProducts(data.results);
      this.productsList.showLoader(false);
    });
  }
}
