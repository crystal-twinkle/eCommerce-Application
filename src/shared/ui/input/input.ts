import ElementBuilder from '../../lib/element-builder';
import './input.scss';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';

interface IInputConfig {
  type?: string;
  placeholder?: string;
  name?: string;
}

export default class Input extends CommonBuilderWrapper {
  constructor(config: IInputConfig) {
    super();

    this.builder = new ElementBuilder({
      tag: 'input',
      styleClass: 'form__input',
      tagSettings: {
        type: config.type || 'text',
        placeholder: config.placeholder || '',
        name: config.name || '',
        autocomplete: 'off',
        required: '',
      },
    });
  }
  getElement(): HTMLInputElement {
    return super.getElement() as HTMLInputElement;
  }
}
