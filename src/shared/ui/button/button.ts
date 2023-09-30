import ElementBuilder, { IElementEvent } from '../../lib/element-builder';
import './button.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import iconsFactory from '../../lib/icons-factory';
import { ButtonIconPosition, IButtonConfig, IButtonIconConfig } from './models';

export default class Button extends CommonBuilderWrapper {
  private badge: ElementBuilder;

  constructor(private config: IButtonConfig) {
    super();

    this.builder = new ElementBuilder({
      tag: 'button',
      content: this.getContent(config.text, config.icon),
      styleClass: `button _${config.type} _${config.size} ${config.styleClass}`,
    });

    if (config.callback) {
      this.builder.setEventHandler({
        type: 'click',
        callback: config.callback,
      });
    }

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

  public setContent(value: string): void {
    this.builder.setContent(this.getContent(value, this.config.icon));
  }

  public setCallback = (event: IElementEvent): void => {
    this.builder.setEventHandler(event);
  };

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
