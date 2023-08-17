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
  private badge: ElementBuilder;

  constructor(
    callback: () => void,
    text: string = '',
    type: ButtonType = ButtonType.DEFAULT,
    icon?: IButtonIconConfig,
    size?: ButtonSize | undefined,
    styleClass: string = '',
  ) {
    super();

    this.builder = new ElementBuilder({
      tag: 'button',
      content: this.getContent(text, icon),
      styleClass: `button _${type} _${size} ${styleClass}`,
      event: {
        type: 'click',
        callback,
      },
    });
    this.badge = new ElementBuilder({
      tag: 'span',
    });

    this.builder.append([this.badge.getElement()]);
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

  public setBadge(value: number): void {
    if (value) {
      this.badge.setContent(String(value));
      this.badge.setStyleClass('button-badge');
    } else {
      this.badge.setStyleClass('button-badge__hide');
    }
  }

  public append(elements: HTMLElement[]): void {
    this.builder.append(elements);
  }
}
