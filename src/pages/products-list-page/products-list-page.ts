import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import ViewBuilder from '../../shared/lib/view-builder';
import PageTitle from '../../features/page-title/page-title';
import ElementBuilder from '../../shared/lib/element-builder';
import ProductsFilter from '../../features/products-filter/products-filter';
import './products-list-page.scss';
import ProductsList from '../../features/products-list/products-list';
import SortBar from '../../features/sort-bar/sort-bar';
import ProductApi from '../../entities/product/api';
import { IProductsFilterParams } from '../../entities/product/model';

export default class ProductsListPage extends ViewBuilder {
  private productsFilter: ProductsFilter;
  private productsList: ProductsList;

  constructor() {
    super('page main-page');
    this.loadProducts();
    ProductApi.getCategories().then(this.productsFilter.setCategories);
  }

  public configureView(): HTMLElement[] {
    const titleView = new PageTitle('Products list');
    const sortBarView = new SortBar((sortParams: string[], searchValue: string) =>
      this.loadProducts(this.productsFilter.getFilterParams(), sortParams, searchValue),
    );
    this.productsList = new ProductsList();
    this.productsFilter = new ProductsFilter((params: IProductsFilterParams) =>
      this.loadProducts(params, sortBarView.getSortParams(), sortBarView.getSearchValue()),
    );
    const productsView = new ElementBuilder({
      tag: 'section',
      styleClass: 'products-list-page',
    });
    productsView.append([this.productsFilter.getElement(), this.productsList.getElement()]);

    return [titleView.getElement(), sortBarView.getElement(), productsView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }

  public loadProducts(filterParams?: IProductsFilterParams, sortParams?: string[], searchParams?: string): void {
    this.productsList.showLoader(true);
    ProductApi.getProductProjections(filterParams, sortParams, searchParams).then((data: ProductProjection[]) => {
      this.productsList.setProducts(data);
      this.productsList.showLoader(false);
    });
  }
}
