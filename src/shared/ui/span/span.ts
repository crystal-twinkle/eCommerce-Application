import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import ElementBuilder from '../../lib/element-builder';

interface SpanConfig {
  class?: string;
  content?: string;
}

export default class Span extends CommonBuilderWrapper {
  constructor(config: SpanConfig) {
    super();

    this.builder = new ElementBuilder({
      tag: 'span',
      content: config.content || '',
    });

    if (config.class) {
      this.builder.setStyleClass(config.class);
    }
  }
}
