import ElementBuilder from '../../lib/element-builder';

interface IOptionBuilderConfig {
  value?: string;
  content: string;
}

export default class OptionBuilder extends ElementBuilder {
  constructor(config: IOptionBuilderConfig) {
    const optionConfig = {
      tag: 'option',
      tagSettings: {
        value: config.value || '',
      },
      content: config.content || '',
    };

    super(optionConfig);
  }
}
