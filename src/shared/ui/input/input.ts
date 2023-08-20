import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import './input.scss';

interface IInputConfig {
  type?: string;
  placeholder?: string;
  name?: string;
}

export default class Input extends CommonBuilderWrapper {
  message: ElementBuilder;
  errorMessage: string;
  validateFunction: (value: string) => boolean;

  constructor(config: IInputConfig, errorMessage: string, validateFunction?: (value: string) => boolean) {
    super();

    this.builder = new ElementBuilder({
      tag: 'input',
      styleClass: 'input',
      tagSettings: {
        type: config.type || 'text',
        placeholder: config.placeholder || '',
        name: config.name || '',
        autocomplete: 'off',
        required: '',
      },
    });
    this.errorMessage = errorMessage;

    this.validateFunction = validateFunction;

    this.showErrorMessage = this.showErrorMessage.bind(this);

    this.builder.setEventHandler({ type: 'input', callback: this.showErrorMessage });
    this.builder.setEventHandler({ type: 'input', callback: this.checkInput.bind(this) });
  }

  private showErrorMessage() {
    this.message = new ElementBuilder({
      tag: 'span',
      styleClass: 'checking-password-message',
      content: this.errorMessage,
    });

    this.builder.getElement().after(this.message.getElement());
  }

  private checkInput() {
    this.builder.getElement().removeEventListener('input', this.showErrorMessage);
    const value = (this.builder.getElement() as HTMLInputElement).value;
    if (!this.validateFunction(value)) {
      this.builder.getElement().after(this.message.getElement());
    } else {
      this.message.getElement().remove();
    }
  }
  getElement(): HTMLInputElement {
    return this.builder.getElement() as HTMLInputElement;
  }
}
