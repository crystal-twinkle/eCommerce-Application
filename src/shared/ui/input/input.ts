import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import './input.scss';

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
      styleClass: 'input',
      tagSettings: {
        type: config.type || 'text',
      },
    });

    if (config.placeholder && config.name) {
      this.builder.setTagSettings({
        placeholder: config.placeholder,
        name: config.name,
        autocomplete: 'off',
      });
    }
  }
  getElement(): HTMLInputElement {
    return super.getElement() as HTMLInputElement;
  }
}
