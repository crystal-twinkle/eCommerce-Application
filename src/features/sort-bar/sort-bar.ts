import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';

export enum SortButtonType {
  PRICE = 'price',
  POPULARITY = 'popularity',
}

export enum SortCriteria {
  BEST,
  WORST,
}

export interface SortButtonCallbackValue {
  type: SortButtonType;
  sortCriteria: SortCriteria;
}

export default class SortBar extends CommonBuilderWrapper {
  private callback: (value: SortButtonCallbackValue) => void;

  constructor(callback: (value: SortButtonCallbackValue) => void) {
    super();
    this.callback = callback;
    this.builder = new ElementBuilder({
      tag: 'section',
      styleClass: 'title',
    });
    const text = new ElementBuilder({
      tag: 'span',
      content: 'Sort by:',
    });

    const priceButton = this.getSortButton(SortButtonType.PRICE);
    const popularityButton = this.getSortButton(SortButtonType.POPULARITY);

    this.builder.append([text.getElement(), priceButton.getElement(), popularityButton.getElement()]);
  }

  private getSortButton = (type: SortButtonType): Button => {
    let content: string = type as string;
    const button = new Button({
      text: content,
      type: ButtonType.AS_TEXT,
    });
    button.setCallback({
      type: 'click',
      callback: () => {
        let sortCriteria: SortCriteria;
        if (content.includes('↑')) {
          content.replace('↑', '↓');
          sortCriteria = SortCriteria.WORST;
        } else if (content.includes('↓')) {
          content.replace('↓', '↑');
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
