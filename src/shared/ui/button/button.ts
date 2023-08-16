import ElementBuilder from '../../lib/element-builder';
import './button.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
}

export enum ButtonType {
  DEFAULT = '',
  DEFAULT_WITHOUT_BORDER = 'without-border',
  DEFAULT_COLORED = 'colored',
  CIRCLE = 'circle',
  CIRCLE_WITHOUT_BORDER = 'circle _without-border',
  CIRCLE_COLORED = 'circle _colored',
}

export enum ButtonIconPosition {
  RIGHT,
  LEFT,
}

export interface IButtonIconConfig {
  name: string;
  position?: ButtonIconPosition;
}

export default class Button extends CommonBuilderWrapper {
  constructor(
    callback: () => void,
    text: string = '',
    type: ButtonType = ButtonType.DEFAULT,
    icon?: IButtonIconConfig,
    size?: ButtonSize | undefined,
  ) {
    super();

    this.builder = new ElementBuilder({
      tag: 'button',
      content: this.getContent(text, icon),
      styleClass: `button _${type} _${size}`,
      event: {
        type: 'click',
        callback,
      },
    });
  }

  private getContent(text: string, icon: IButtonIconConfig): string {
    let content: string = '';

    if (icon?.position === ButtonIconPosition.LEFT) {
      content += iconsFactory.get(icon.name);
    }
    if (text) {
      content += `<span>${text}</span>`;
    }
    if (icon?.position === ButtonIconPosition.RIGHT) {
      content += iconsFactory.get(icon.name);
    }

    return `<span>${content}</span>`;
  }
}
