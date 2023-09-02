import { Product } from '@commercetools/platform-sdk';
import ViewBuilder from '../../shared/lib/view-builder';
import PageTitle from '../../features/page-title/page-title';
import ElementBuilder from '../../shared/lib/element-builder';
import ProductsFilter from '../../features/products-filter/products-filter';
import './products-list-page.scss';
import ProductsList from '../../features/products-list/products-list';
import { SortButtonCallbackValue } from '../../features/sort-bar/sort-bar.models';
import SortBar from '../../features/sort-bar/sort-bar';
import ProductApi from '../../entities/product-api';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';

export default class ProductsListPage extends ViewBuilder {
  private productsFilter: ProductsFilter;
  private productsList: ProductsList;
  private filterData: Product[];
  private data: Product[];

  constructor() {
    super('page main-page');
    this.loadProducts();
    eventBus.subscribe(EventBusActions.SORT_CATALOG, (categoryName) => {
      this.searchByDropdown(categoryName as string);
    });
    eventBus.subscribe(EventBusActions.SEARCH_PRODUCT, (value) => {
      this.searchByProduct(value as string);
    });
    eventBus.subscribe(EventBusActions.SORT_BY_PRICE, (value) => {
      this.sortByPrice(value as string);
    });
    eventBus.subscribe(EventBusActions.SORT_BY_ALPHABET, (value) => {
      this.sortByAlphabet(value as string);
    });
  }

  public configureView(): HTMLElement[] {
    const titleView = new PageTitle('Блузки и рубашки для женщин', 'Арт. 123123');
    const sortBarView = new SortBar(this.sortClick);
    this.productsList = new ProductsList();
    this.productsFilter = new ProductsFilter();
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

  public sortClick(sortValue: SortButtonCallbackValue): void {}

  protected searchByDropdown(value: string): void {
    this.filterData = this.data.filter((e) => {
      return e.masterData.current.name?.['en-US'].includes(value);
    });
    if (!this.filterData.length) {
      this.filterData = this.data;
    }
    this.productsList.setProducts(this.filterData);
  }

  protected searchByProduct(value: string): void {
    this.filterData = this.filterData.filter((e) => {
      return e.masterData.current.name?.['en-US'].toLowerCase().includes(value);
    });
    this.productsList.setProducts(this.filterData);
  }

  protected sortByPrice(value: string) {
    const getPrice = (item: Product) => item.masterData.current.masterVariant.prices[0]?.value?.centAmount || 0;
    if (value === '↓') {
      // Сортировка по убыванию цены
      this.filterData.sort((a, b) => getPrice(a) - getPrice(b));
    }
    if (value === '↑') {
      // Сортировка по возрастанию цены
      this.filterData.sort((a, b) => getPrice(b) - getPrice(a));
    }
    this.productsList.setProducts(this.filterData);
  }

  protected sortByAlphabet(value: string) {
    const getLetter = (item: Product) => item.masterData.current.name?.['en-US'] || '';
    this.filterData.forEach((e) => console.log(getLetter(e)));
    if (value === '↓') {
      this.filterData.sort((a, b) => getLetter(a).localeCompare(getLetter(b)));
    }
    if (value === '↑') {
      this.filterData.sort((a, b) => getLetter(b).localeCompare(getLetter(a)));
    }
    this.productsList.setProducts(this.filterData);
  }

  public loadProducts(): void {
    this.productsList.showLoader(true);
    ProductApi.getProducts().then((data: Product[]) => {
      this.data = data;
      this.filterData = data;
      this.productsList.setProducts(data);
      this.productsList.showLoader(false);
    });
  }
}
