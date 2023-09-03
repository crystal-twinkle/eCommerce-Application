import ElementBuilder from '../../lib/element-builder';
import './dropdown.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';
import { IDropdownConfig, IDropdownItem } from './models';

export default class Dropdown extends CommonBuilderWrapper {
  private selectedItem: IDropdownItem;
  private items: IDropdownItem[];
  private itemsBuilder: ElementBuilder;
  private textBuilder: ElementBuilder;
  private arrowBuilder: ElementBuilder;

  constructor(private config: IDropdownConfig) {
    super();
    this.items = config.items;
    this.selectedItem = typeof config.selectedItemIndex === 'number' ? this.items[config.selectedItemIndex] : null;

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: `dropdown ${config.styleClass || ''}`,
    });

    const button = new ElementBuilder({
      tag: 'button',
      styleClass: `dropdown-button _${config.type || ''}`,
      tagSettings: {
        type: 'button',
      },
    });
    this.textBuilder = new ElementBuilder({
      tag: 'span',
      styleClass: 'dropdown-empty',
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
    this.setItems(config.items);
    this.builder.append([button.getElement(), this.itemsBuilder.getElement()]);
  }

  private selectItem = (event: Event): void => {
    const htmlItemData: DOMStringMap = (event.srcElement as HTMLElement).dataset;
    this.selectedItem = this.items[htmlItemData.index as unknown as number];
    console.log(this.selectedItem, this.selectedItem.content);
    this.textBuilder.setContent(this.selectedItem.content);
    this.textBuilder.setStyleClass();
    this.config.callback?.(this.selectedItem);
  };

  public getSelectedItem(): IDropdownItem {
    return this.selectedItem;
  }

  public setSelectedItem(value: string): void {
    this.textBuilder.setContent(value);
  }

  public getSelectedText(): string {
    return this.textBuilder.getElement().textContent;
  }

  public setItems(items: IDropdownItem[], selectedItemIndex?: number): void {
    this.items = items;
    this.selectedItem = typeof selectedItemIndex === 'number' ? this.items[selectedItemIndex] : null;

    this.textBuilder.setContent();
    this.textBuilder.setContent(this.selectedItem?.content || this.config.placeholder);

    this.itemsBuilder.setContent();
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
  }
}
