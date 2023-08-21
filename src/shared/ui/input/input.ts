import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import { ValidationParams } from '../../lib/validate/validation-params';
import './input.scss';

interface IInputConfig {
  type?: string;
  placeholder?: string;
  name?: string;
}

interface IInputConfig {
  type?: string;
  placeholder?: string;
  name?: string;
}

export default class Input extends CommonBuilderWrapper {
  message: ElementBuilder;
  config: IInputConfig;

  constructor(config: IInputConfig) {
    super();

    this.config = config;
    this.builder = new ElementBuilder({
      tag: 'input',
      styleClass: 'input',
      tagSettings: {
        type: config.type || 'text',
      },
    });
    if (config.name) {
      this.builder.setTagSettings({
        placeholder: config.placeholder || '',
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
    const value = (this.builder.getElement() as HTMLInputElement).value;
    if (!ValidationParams[this.config.name].validateFunction(value)) {
      this.builder.getElement().after(this.message.getElement());
      this.builder.getElement().classList.add('input_invalid');
    } else {
      this.builder.getElement().classList.remove('input_invalid');
      this.message.getElement().remove();
    }
  }
  getElement(): HTMLInputElement {
    return this.builder.getElement() as HTMLInputElement;
  }
}
