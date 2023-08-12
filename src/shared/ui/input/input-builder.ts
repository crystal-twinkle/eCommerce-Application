import ElementBuilder from '../../lib/element-builder';

interface IInputBuilderConfig {
  type?: string;
  placeholder?: string;
}

export default class InputBuilder extends ElementBuilder {
  constructor(config: IInputBuilderConfig) {
    super({
      tag: 'input',
      styleClass: 'form__input',
      tagSettings: {
        type: config.type || 'text',
        placeholder: config.placeholder || '',
        required: 'required',
      },
    });
  }
}
