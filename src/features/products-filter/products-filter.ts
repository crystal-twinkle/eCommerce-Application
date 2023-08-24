import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './products-filter.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import AccordionItem from '../../shared/ui/accordion-item/accordion-item';

export default class ProductsFilter extends CommonBuilderWrapper {
  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'section',
    });
  }
}
