import ViewBuilder from '../../shared/lib/view-builder';
import Title from '../../features/title/title';
import ElementBuilder from '../../shared/lib/element-builder';
import ProductsFilter from '../../features/products-filter/products-filter';
import './products-list-page.scss';
import ProductsList from '../../features/products-list/products-list';
import flowFactory from '../../app/api-flow/flow-factory';
import SortBar, { SortButtonCallbackValue } from '../../features/sort-bar/sort-bar';

export default class ProductsListPage extends ViewBuilder {
  private productsFilter: ProductsFilter;
  private productsList: ProductsList;

  constructor() {
    super('page main-page');
    this.loadProducts();
  }

  public configureView(): HTMLElement[] {
    const titleView = new Title('Блузки и рубашки для женщин');
    const sortBarView = new SortBar(this.sortClick);
    this.productsList = new ProductsList();
    this.productsFilter = new ProductsFilter();
    const productsView = new ElementBuilder({
      tag: 'article',
      styleClass: 'products-list-page',
    });
    productsView.append([this.productsFilter.getElement(), this.productsList.getElement()]);

    return [titleView.getElement(), sortBarView.getElement(), productsView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }

  public sortClick = (sortValue: SortButtonCallbackValue): void => {
    console.log(sortValue);
  };

  public loadProducts(): void {
    this.productsList.showLoader(true);
    flowFactory.refreshTokenFlow
      .products()
      .get()
      .execute()
      .then((data) => {
        this.productsList.setProducts(data.body.results);
        this.productsList.showLoader(false);
      });
  }
}
