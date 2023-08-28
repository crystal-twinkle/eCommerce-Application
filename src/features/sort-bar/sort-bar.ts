import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';
import './sort.bar.scss';
import { SortButtonCallbackValue, SortButtonType, SortCriteria } from './sort-bar.models';
import Input from '../../shared/ui/input/input';

export default class SortBar extends CommonBuilderWrapper {
  private buttons: {
    text: string;
    button: Button;
  }[];

  constructor(private callback: (value: SortButtonCallbackValue) => void) {
    super();

    this.builder = new ElementBuilder({
      tag: 'section',
      styleClass: 'sort-bar',
    });

    this.builder.append([this.getSortControlPanel().getElement(), this.getSearchField().getElement()]);
  }

  private getSearchField(): ElementBuilder {
    const searchIcon = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__search-icon',
    });
    const searchInput = new Input({
      type: 'text',
      placeholder: 'Search',
    });
    const searchField = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__search',
    });
    searchField.append([searchIcon.getElement(), searchInput.getElement()]);
    return searchField;
  }

  private getSortControlPanel(): ElementBuilder {
    const sortTitle = new ElementBuilder({
      tag: 'span',
      styleClass: 'sort-bar__title',
      content: 'Sort by:',
    });
    this.buttons = [
      {
        text: SortButtonType.PRICE,
        button: this.getSortButton(SortButtonType.PRICE),
      },
      {
        text: SortButtonType.POPULARITY,
        button: this.getSortButton(SortButtonType.POPULARITY),
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
          sortCriteria = SortCriteria.WORST;
        } else if (content.includes('↓')) {
          content = content.replace('↓', '↑');
          sortCriteria = SortCriteria.BEST;
        } else {
          content += ' ↑';
          sortCriteria = SortCriteria.BEST;
        }
        button.setContent(content);
        this.callback({ type, sortCriteria });
      },
    });
    return button;
  };
}
