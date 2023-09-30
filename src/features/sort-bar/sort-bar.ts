import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';
import './sort.bar.scss';
import { SortButtonType, SortCriteria } from './sort-bar.models';
import Input from '../../shared/ui/input/input';

export enum SortChangeType {
  SORT,
  SEARCH,
}

export default class SortBar extends CommonBuilderWrapper {
  private readonly INPUT_TIMEOUT: number = 1000;

  private buttons: {
    text: string;
    button: Button;
  }[];
  private sortParams: string[];
  private searchTimeout: ReturnType<typeof setTimeout>;
  private searchValue: string;
  private searchInput: Input;

  constructor(
    private sortBarCallback: (changeType: SortChangeType, sortParams: string[], searchValue: string) => void,
  ) {
    super();
    this.sortParams = [];
    this.builder = new ElementBuilder({
      tag: 'section',
      styleClass: 'sort-bar',
    });
    this.builder.append([this.getSortControlPanel().getElement(), this.getSearchField().getElement()]);
  }

  private getSearchField = (): ElementBuilder => {
    const searchIcon = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__search-icon',
    });
    this.searchInput = new Input({
      type: 'text',
      placeholder: 'Search',
    });
    this.searchInput.setEventHandler({
      type: 'input',
      callback: (event) => {
        this.searchValue = (event.srcElement as HTMLInputElement).value;
        if (this.searchValue === '') {
          this.searchValue = null;
        }
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(
          () => this.sortBarCallback(SortChangeType.SEARCH, this.sortParams, this.searchValue),
          this.INPUT_TIMEOUT,
        );
      },
    });
    const searchField = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__search',
    });
    searchField.append([searchIcon.getElement(), this.searchInput.getElement()]);
    return searchField;
  };

  private getSortControlPanel(): ElementBuilder {
    const sortTitle = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__title',
      content: 'Sort by:',
    });
    const priceSortButton: Button = this.getSortButton(SortButtonType.PRICE);
    const alphabetSortButton: Button = this.getSortButton(SortButtonType.ALPHABET);

    this.buttons = [
      {
        text: SortButtonType.PRICE,
        button: priceSortButton,
      },
      {
        text: SortButtonType.ALPHABET,
        button: alphabetSortButton,
      },
    ];
    const sortControlPanel = new ElementBuilder({
      tag: 'span',
    });
    sortControlPanel.append([sortTitle.getElement(), ...this.buttons.map((btn) => btn.button.getElement())]);
    return sortControlPanel;
  }

  private getSortButton = (type: SortButtonType): Button => {
    let content: string = type as string;
    const button = new Button({
      text: content,
      styleClass: 'sort-bar__button',
      type: ButtonType.AS_TEXT,
    });
    button.setCallback({
      type: 'click',
      callback: () => {
        this.buttons.filter((btn) => button !== btn.button).forEach((btn) => btn.button.setContent(btn.text));

        let sortCriteria: SortCriteria;
        if (content.includes('↑')) {
          content = content.replace('↑', '↓');
          sortCriteria = SortCriteria.DESC;
        } else if (content.includes('↓')) {
          content = content.replace('↓', '↑');
          sortCriteria = SortCriteria.ASC;
        } else {
          content += ' ↑';
          sortCriteria = SortCriteria.ASC;
        }
        button.setContent(content);
        this.sortParams = [`${type === SortButtonType.ALPHABET ? 'name.en-us' : 'price'} ${sortCriteria}`];
        this.sortBarCallback(SortChangeType.SORT, this.sortParams, this.searchValue);
      },
    });
    return button;
  };

  public getSortParams = (): string[] => {
    return this.sortParams;
  };

  public getSearchValue = (): string => {
    return this.searchValue;
  };
}
