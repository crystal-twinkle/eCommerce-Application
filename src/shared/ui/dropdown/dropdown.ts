import ElementBuilder from '../../lib/element-builder';
import './dropdown.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';

export interface DropdownItem {
  value: string;
  content: string;
}

export default class Dropdown extends CommonBuilderWrapper {
  constructor(items: DropdownItem[]) {
    super();

    this.builder = new ElementBuilder({
      tag: 'select',
      styleClass: 'dropdown',
    });

    this.builder.append(
      items.map((item: DropdownItem) =>
        new ElementBuilder({
          tag: 'option',
          tagSettings: {
            value: item.value || '',
          },
          content: item.content || '',
        }).getElement(),
      ),
    );
  }
}
