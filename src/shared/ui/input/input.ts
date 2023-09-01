import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import { ValidationParams } from '../../lib/validate/validation-params';
import './input.scss';
import checkValidator from '../../lib/validate/check-validaror';

interface IInputConfig {
  type?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  styleClass?: string;
}

export default class Input extends CommonBuilderWrapper {
  message: ElementBuilder;
  config: IInputConfig;

  constructor(config: IInputConfig) {
    super();

    this.config = config;
    this.builder = new ElementBuilder({
      tag: 'input',
      styleClass: `input ${config.styleClass || ''}`,
      tagSettings: {
        type: config.type || 'text',
      },
    });
    if (config.placeholder) {
      this.builder.setTagSettings({
        placeholder: config.placeholder,
      });
    }
    if (config.value) {
      this.builder.setTagSettings({
        value: config.value,
      });
    }
    if (config.name) {
      this.builder.setTagSettings({
        name: config.name,
        autocomplete: 'off',
      });

      this.message = new ElementBuilder({
        tag: 'div',
        styleClass: 'error-message',
        content: ValidationParams[this.config.name].message,
      });

      this.showErrorMessage = this.showErrorMessage.bind(this);

      this.builder.setEventHandler({ type: 'input', callback: this.showErrorMessage });
      this.builder.setEventHandler({ type: 'input', callback: this.checkInput.bind(this) });
    }
  }

  protected showErrorMessage() {
    this.builder.getElement().after(this.message.getElement());
  }

  protected checkInput() {
    this.builder.getElement().removeEventListener('input', this.showErrorMessage);
    const inputElem = this.builder.getElement() as HTMLInputElement;
    if (!checkValidator(inputElem)) {
      this.builder.getElement().after(this.message.getElement());
    } else {
      this.message.getElement().remove();
    }
  }

  getElement(): HTMLInputElement {
    return this.builder.getElement() as HTMLInputElement;
  }

  public setTagSettings(tagSettings: { [id: string]: string }): Input {
    this.builder.setTagSettings(tagSettings);
    return this;
  }
}
