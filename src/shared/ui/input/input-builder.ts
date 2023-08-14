import ElementBuilder from '../../lib/element-builder';
import './input.scss';

interface IInputBuilderConfig {
  type?: string;
  placeholder?: string;
  name?: string;
}

export default class InputBuilder extends ElementBuilder {
  constructor(config: IInputBuilderConfig) {
    super({
      tag: 'input',
      styleClass: 'form__input',
      tagSettings: {
        type: config.type || 'text',
        placeholder: config.placeholder || '',
        name: config.name || '',
        // required: 'required',
      },
    });
  }

  getElement(): HTMLInputElement {
    return super.getElement() as HTMLInputElement;
  }
}
