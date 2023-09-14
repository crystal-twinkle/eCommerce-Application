import { Category } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-filter.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import { IProductsFilterParams } from '../../entities/product/model';
import Dropdown from '../../shared/ui/dropdown/dropdown';
import { IDropdownItem } from '../../shared/ui/dropdown/models';

export default class ProductsFilter extends CommonBuilderWrapper {
  private readonly INPUT_TIMEOUT: number = 1000;

  private filterParams: IProductsFilterParams;
  private categoriesField: Dropdown;
  private priceFromTimeout: ReturnType<typeof setTimeout>;
  private priceToTimeout: ReturnType<typeof setTimeout>;
  private priceFrom: number;
  private priceTo: number;
  private priceFromInput: Input;
  private priceToInput: Input;
  private allCategoryId: string;

  constructor(private filterCallback: (params: IProductsFilterParams) => void) {
    super();
    this.filterParams = {};
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter',
    });

    // const emptyArea = new ElementBuilder({
    //   // need for sticky elements
    //   tag: 'div',
    //   styleClass: 'products-filter__empty-area',
    // });
    this.builder.append([
      this.getCategoriesField().getElement(),
      this.getPriceField().getElement(),
      // emptyArea.getElement(),
    ]);
  }

  private getCategoriesField(): ElementBuilder {
    const catalogFieldBuilder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter__categories',
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
        if (this.filterParams.categoryId !== selectedItem.value) {
          this.filterParams.categoryId = selectedItem.value;
          this.filterCallback(this.getFilterParams());
        }
      },
    });
    catalogFieldBuilder.append([fieldName.getElement(), this.categoriesField.getElement()]);
    return catalogFieldBuilder;
  }

  private getPriceField(): ElementBuilder {
    const priceFieldBuilder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter__prices',
    });
    const fieldName = new ElementBuilder({
      tag: 'div',
      content: 'Price, $',
      styleClass: 'products-filter__field-title',
    });
    this.priceFromInput = new Input({
      type: 'number',
      styleClass: 'products-filter__price-input',
      placeholder: 'From',
      settings: {
        min: '0',
      },
    });
    this.priceFromInput.setEventHandler({
      type: 'input',
      callback: (event) => {
        const value: number = +(event.srcElement as HTMLInputElement).value;
        if (typeof value === 'number' && value > 0) {
          clearTimeout(this.priceFromTimeout);
          this.priceFromTimeout = setTimeout(() => {
            this.priceFrom = value;
            this.updatePriceFilterParam();
            this.filterCallback(this.getFilterParams());
          }, this.INPUT_TIMEOUT);
        } else {
          this.priceFrom = null;
          this.priceFromInput.setValue('');
          this.updatePriceFilterParam();
          this.filterCallback(this.getFilterParams());
        }
      },
    });
    this.priceToInput = new Input({
      type: 'number',
      styleClass: 'products-filter__price-input',
      placeholder: 'To',
      settings: {
        min: '0',
      },
    });
    this.priceToInput.setEventHandler({
      type: 'input',
      callback: (event) => {
        const value: number = +(event.srcElement as HTMLInputElement).value;
        if (typeof value === 'number' && value > 0) {
          clearTimeout(this.priceToTimeout);
          this.priceToTimeout = setTimeout(() => {
            this.priceTo = value;
            this.updatePriceFilterParam();
            this.filterCallback(this.getFilterParams());
          }, this.INPUT_TIMEOUT);
        } else {
          this.priceTo = null;
          this.priceToInput.setValue('');
          this.updatePriceFilterParam();
          this.filterCallback(this.getFilterParams());
        }
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

    inputWrapper.append([this.priceFromInput.getElement(), separator.getElement(), this.priceToInput.getElement()]);
    priceFieldBuilder.append([fieldName.getElement(), inputWrapper.getElement()]);

    return priceFieldBuilder;
  }

  private updatePriceFilterParam = (): void => {
    this.filterParams.price =
      !this.priceFrom && !this.priceTo
        ? null
        : `(${this.priceFrom ? this.priceFrom * 100 : '*'} to ${this.priceTo ? this.priceTo * 100 : '*'})`;
  };

  public setCategories = (categories: Category[]): void => {
    const preparedCategories: IDropdownItem[] = [];
    let allCategoryIndex: number = 0;
    categories.forEach((category: Category, index: number) => {
      preparedCategories.push({ content: category.name['en-US'], value: category.id, data: category });
      if (category.key === 'all') {
        allCategoryIndex = index;
        this.allCategoryId = category.id;
        this.filterParams.categoryId = category.id;
      }
    });
    this.categoriesField.setItems(preparedCategories, allCategoryIndex);
  };

  public getFilterParams = (): IProductsFilterParams => {
    return {
      ...this.filterParams,
      categoryId: this.filterParams.categoryId === this.allCategoryId ? null : this.filterParams.categoryId,
    };
  };
}
