import ElementBuilder from '../../lib/element-builder';
import './dropdown.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';
import { IDropdownConfig, IDropdownItem } from './models';

export default class Dropdown extends CommonBuilderWrapper {
  private selectedItem: IDropdownItem;
  private items: IDropdownItem[];
  private itemsBuilder: ElementBuilder;
  private itemsWrapperBuilder: ElementBuilder;
  private textBuilder: ElementBuilder;
  private arrowBuilder: ElementBuilder;
  private button: ElementBuilder;
  private opened: boolean;

  constructor(private config: IDropdownConfig) {
    super();
    this.items = config.items;
    this.selectedItem = typeof config.selectedItemIndex === 'number' ? this.items[config.selectedItemIndex] : null;

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: `dropdown ${config.styleClass || ''}`,
    });

    this.button = new ElementBuilder({
      tag: 'button',
      styleClass: `dropdown-button _${config.type || ''}`,
      tagSettings: {
        type: 'button',
      },
      event: {
        type: 'click',
        callback: this.itemsVisibleChange,
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
    this.button.append([this.textBuilder.getElement(), this.arrowBuilder.getElement()]);

    this.itemsBuilder = new ElementBuilder({
      tag: 'ul',
      styleClass: 'dropdown-list',
      event: {
        type: 'click',
        callback: this.selectItem,
      },
    });
    this.itemsWrapperBuilder = new ElementBuilder({
      tag: 'div',
      styleClass: 'dropdown-list__wrapper',
      event: {
        type: 'click',
        callback: this.itemsVisibleChange,
      },
    });

    this.setItems(config.items, config.selectedItemIndex);
    this.builder.append([this.button.getElement()]);
  }

  private itemsVisibleChange = (): void => {
    this.opened = !this.opened;
    if (this.opened) {
      this.builder.addStyleClass('_active');
      this.builder.append([this.itemsBuilder.getElement(), this.itemsWrapperBuilder.getElement()]);
    } else {
      this.builder.removeStyleClass('_active');
      this.builder.setContent();
      this.builder.append([this.button.getElement()]);
    }
  };

  private selectItem = (event: Event): void => {
    const htmlItemData: DOMStringMap = (event.srcElement as HTMLElement).dataset;
    this.selectedItem = this.items[htmlItemData.index as unknown as number];
    this.textBuilder.setContent(this.selectedItem.content);
    this.textBuilder.setStyleClass();
    this.config.callback?.(this.selectedItem);
    this.itemsVisibleChange();
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

  public setItems = (items: IDropdownItem[], selectedItemIndex?: number): void => {
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
  };
}
