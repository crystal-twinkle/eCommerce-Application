import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import Button from '../button/button';
import { ButtonIconPosition, ButtonType } from '../button/models';
import ElementBuilder from '../../lib/element-builder';
import './accordion-item.scss';

export default class AccordionItem extends CommonBuilderWrapper {
  constructor(title: string) {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'accordion-item',
    });

    const button = new Button({
      callback: () => {},
      text: title,
      type: ButtonType.DEFAULT,
      icon: {
        name: 'arrow-up',
        position: ButtonIconPosition.RIGHT,
      },
    });
    const content = new ElementBuilder({
      tag: 'div',
      content: 'content',
    });

    this.builder.append([button.getElement(), content.getElement()]);
  }
}
