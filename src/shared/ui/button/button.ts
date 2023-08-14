import ElementBuilder from '../../lib/element-builder';
import './button.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
}

export default class Button extends CommonBuilderWrapper {
  constructor(
    callback: () => void,
    text: string = '',
    colored?: boolean,
    icon?: string,
    rounded?: boolean,
    size?: ButtonSize | undefined,
  ) {
    super();

    let styleClass = 'button';
    if (rounded) {
      styleClass += ' _rounded';
    }
    if (colored) {
      styleClass += ' _colored';
    }
    if (size) {
      styleClass += ` _${size}`;
    }

    this.builder = new ElementBuilder({
      tag: 'button',
      content: this.getContent(text, icon),
      styleClass,
      event: {
        type: 'click',
        callback,
      },
    });
  }

  private getContent(text: string, icon: string): string {
    return `<span>
        ${text ? `<span>${text}</span>` : ''}
        ${icon ? iconsFactory.get(icon) : ''}
    </span>`;
  }
}
