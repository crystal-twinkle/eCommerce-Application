import { Category } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-filter.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import { IProductsFilterParams } from '../../entities/product/model';
import Dropdown from '../../shared/ui/dropdown/dropdown';
import { IDropdownItem } from '../../shared/ui/dropdown/models';

export default class ProductsFilter extends CommonBuilderWrapper {
  private filterParams: IProductsFilterParams;
  private categoriesField: Dropdown;
  private priceFromTimeout: ReturnType<typeof setTimeout>;
  private priceToTimeout: ReturnType<typeof setTimeout>;
  private priceFrom: number;
  private priceTo: number;

  constructor(private filterCallback: (params: IProductsFilterParams) => void) {
    super();
    this.filterParams = {};
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter',
    });
    this.builder.append([this.getCategoriesField().getElement(), this.getPriceField().getElement()]);
  }

  private getCategoriesField(): ElementBuilder {
    const catalogFieldBuilder = new ElementBuilder({
      tag: 'div',
    });
    const fieldName = new ElementBuilder({
      tag: 'div',
      content: 'Catalog',
      styleClass: 'products-filter__field-title',
    });
    this.categoriesField = new Dropdown({
      placeholder: 'Categories',
      items: [],
      callback: (selectedItem: IDropdownItem) => {
        this.filterParams.categoryId = (selectedItem.data as Category).key !== 'all' ? selectedItem.value : null;
        this.filterCallback(this.filterParams);
      },
    });
    catalogFieldBuilder.append([fieldName.getElement(), this.categoriesField.getElement()]);
    return catalogFieldBuilder;
  }

  private getPriceField(): ElementBuilder {
    const priceFieldBuilder = new ElementBuilder({
      tag: 'div',
    });
    const fieldName = new ElementBuilder({
      tag: 'div',
      content: 'Price, $',
      styleClass: 'products-filter__field-title',
    });
    const inputFrom = new Input({
      type: 'number',
      styleClass: 'products-filter__price-input',
      placeholder: 'From',
      event: {
        type: 'input',
        callback: (event) => {
          this.priceFrom = +(event.srcElement as HTMLInputElement).value;
          clearTimeout(this.priceFromTimeout);
          this.priceFromTimeout = setTimeout(() => {
            this.updatePriceFilterParam();
            this.filterCallback(this.filterParams);
          }, 2000);
        },
      },
    });
    const inputTo = new Input({
      type: 'number',
      styleClass: 'products-filter__price-input',
      placeholder: 'To',
      event: {
        type: 'input',
        callback: (event) => {
          this.priceTo = +(event.srcElement as HTMLInputElement).value;
          clearTimeout(this.priceToTimeout);
          this.priceToTimeout = setTimeout(() => {
            this.updatePriceFilterParam();
            this.filterCallback(this.filterParams);
          }, 2000);
        },
      },
    });
    const separator = new ElementBuilder({
      tag: 'span',
      content: '—',
    });
    const inputWrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter__price-input-wrapper',
    });

    inputWrapper.append([inputFrom.getElement(), separator.getElement(), inputTo.getElement()]);
    priceFieldBuilder.append([fieldName.getElement(), inputWrapper.getElement()]);

    return priceFieldBuilder;
  }

  private updatePriceFilterParam = (): void => {
    this.filterParams.price = `(${this.priceFrom || '*'} to ${this.priceTo || '*'})`;
  };

  public setCategories = (categories: Category[]): void => {
    this.categoriesField.setItems(
      categories.map((category: Category) => ({ content: category.name['en-US'], value: category.id, data: category })),
      0,
    );
  };

  public getFilterParams(): IProductsFilterParams {
    return this.filterParams;
  }
}
