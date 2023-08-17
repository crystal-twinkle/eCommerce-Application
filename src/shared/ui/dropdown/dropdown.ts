import ElementBuilder from '../../lib/element-builder';
import './dropdown.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';

export interface IDropdownItem {
  value: string;
  content: string;
}

export interface IDropdownConfig {
  items: IDropdownItem[];
  selectedItemIndex?: number;
  placeholder?: string;
  type?: DropdownType;
  required?: boolean;
  styleClass?: string;
}

export enum DropdownType {
  DEFAULT = '',
  FORM = 'form',
}

export default class Dropdown extends CommonBuilderWrapper {
  private selectedItem: IDropdownItem;
  private items: IDropdownItem[];
  private itemsBuilder: ElementBuilder;
  private textBuilder: ElementBuilder;
  private arrowBuilder: ElementBuilder;

  constructor(config: IDropdownConfig) {
    super();
    this.items = config.items;
    this.selectedItem = config.selectedItemIndex ? this.items[0] : null;

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: `dropdown ${config.styleClass || ''}`,
    });

    const button = new ElementBuilder({
      tag: 'button',
      styleClass: `dropdown-button _${config.type}`,
      tagSettings: {
        type: 'button',
      },
    });
    this.textBuilder = new ElementBuilder({
      tag: 'span',
      styleClass: 'dropdown-empty',
      content: this.selectedItem?.content || config.placeholder || 'Select item',
    });
    this.arrowBuilder = new ElementBuilder({
      tag: 'span',
      styleClass: 'dropdown-arrow',
      content: iconsFactory.get('arrow-up'),
    });
    button.append([this.textBuilder.getElement(), this.arrowBuilder.getElement()]);

    this.itemsBuilder = new ElementBuilder({
      tag: 'ul',
      styleClass: 'dropdown-list',
      event: {
        type: 'click',
        callback: this.selectItem,
      },
    });

    this.itemsBuilder.append(
      this.items.map((item: IDropdownItem, index: number) => {
        return new ElementBuilder({
          tag: 'li',
          content: item.content,
          tagSettings: {
            'data-index': index.toString(),
            value: item.value,
          },
        }).getElement();
      }),
    );

    this.builder.append([button.getElement(), this.itemsBuilder.getElement()]);
  }

  private selectItem = (event: Event): void => {
    const htmlItemData: DOMStringMap = (event.srcElement as HTMLElement).dataset;
    this.selectedItem = this.items[htmlItemData.index as unknown as number];
    this.textBuilder.setContent(this.selectedItem.content);
    this.textBuilder.setStyleClass();
  };

  public getSelectedItem(): IDropdownItem {
    return this.selectedItem;
  }
}
