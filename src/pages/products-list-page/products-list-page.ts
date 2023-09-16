import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import ViewBuilder from '../../shared/lib/view-builder';
import ElementBuilder from '../../shared/lib/element-builder';
import ProductsFilter from '../../features/products-filter/products-filter';
import './products-list-page.scss';
import ProductsList from '../../features/products-list/products-list';
import SortBar, { SortChangeType } from '../../features/sort-bar/sort-bar';
import ProductApi from '../../entities/product/api';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import store from '../../app/store';

export default class ProductsListPage extends ViewBuilder {
  private productsFilter: ProductsFilter;
  private productsList: ProductsList;
  private sortBarView: SortBar;
  private offset: number;
  private limit: number;
  private lazyLoadingInProgress: boolean;

  constructor() {
    super('page main-page');
    this.offset = 0;
    this.limit = 10;
    this.loadProducts();
    ProductApi.getCategories().then(this.productsFilter.setCategories);

    eventBus.subscribe(EventBusActions.SCROLL_END, () => {
      if (!this.lazyLoadingInProgress && store.products?.total > store.products?.results?.length) {
        this.offset += this.limit;
        this.loadProducts();
      }
    });
  }

  public configureView(): HTMLElement[] {
    this.sortBarView = new SortBar((changeType: SortChangeType) =>
      this.loadProducts(true, changeType === SortChangeType.SORT),
    );
    this.productsList = new ProductsList();
    this.productsFilter = new ProductsFilter(() => this.loadProducts(true));
    const productsView = new ElementBuilder({
      tag: 'section',
      styleClass: 'products-list-page',
    });

    const filterWrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list-page__filter',
    });
    const filterEmptyArea = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-list-page__filter-empty-area',
    });
    filterWrapper.append([this.productsFilter.getElement(), filterEmptyArea.getElement()]);
    productsView.append([filterWrapper.getElement(), this.productsList.getElement()]);

    return [this.sortBarView.getElement(), productsView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }

  public loadProducts(resetStore?: boolean, loadSameAmount?: boolean): void {
    this.lazyLoadingInProgress = true;
    this.productsList.showLoader(true);
    ProductApi.getProductProjections(
      resetStore || loadSameAmount ? 0 : this.offset,
      loadSameAmount ? this.offset + this.limit : this.limit,
      this.productsFilter.getFilterParams(),
      this.sortBarView.getSortParams(),
      this.sortBarView.getSearchValue(),
      resetStore,
    )
      .then((data: ProductProjection[]) => {
        this.productsList.setProducts(data);
        this.productsList.showLoader(false);
        this.lazyLoadingInProgress = false;
      })
      .catch(() => {
        this.lazyLoadingInProgress = false;
      });

    if (resetStore) {
      this.offset = 0;
    }
  }
}
