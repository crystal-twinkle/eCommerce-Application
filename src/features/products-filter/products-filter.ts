import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-filter.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import { CATALOG_ITEMS } from './products-filter.model';
import store from '../../app/store';
import Dropdown, { DropdownType } from '../../shared/ui/dropdown/dropdown';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';

const catalogDropdown = new Dropdown({
  type: DropdownType.DEFAULT,
  items: CATALOG_ITEMS,
  selectedItemIndex: 0,
});

export default class ProductsFilter extends CommonBuilderWrapper {
  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'products-filter',
    });

    this.builder.append([this.getCatalogField().getElement(), this.getPriceField().getElement()]);
  }

  private getCatalogField(): ElementBuilder {
    const catalogFieldBuilder = new ElementBuilder({
      tag: 'div',
    });
    const fieldName = new ElementBuilder({
      tag: 'div',
      content: 'Catalog',
      styleClass: 'products-filter__field-title',
    });
    let oldText = 'All';
    catalogDropdown.getElement().addEventListener('click', () => {
      const catalogDropdownText: string = catalogDropdown?.getSelectedItem()?.content;
      if (catalogDropdownText && catalogDropdownText !== oldText) {
        store.setCategory(catalogDropdownText);
        oldText = catalogDropdownText;
      }
    });
    catalogFieldBuilder.append([fieldName.getElement(), catalogDropdown.getElement()]);
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
    });
    const inputTo = new Input({
      type: 'number',
      styleClass: 'products-filter__price-input',
      placeholder: 'To',
    });

    const priceSearchButton = new Button({
      type: ButtonType.DEFAULT,
      text: 'Search',
      callback: () => {
        const fromText = Number(inputFrom.getElement().value);
        const toText = Number(inputTo.getElement().value);
        eventBus.publish(EventBusActions.SORT_BY_PRICE_FROM, [fromText, toText]);
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
    priceFieldBuilder.append([fieldName.getElement(), inputWrapper.getElement(), priceSearchButton.getElement()]);

    return priceFieldBuilder;
  }
}
