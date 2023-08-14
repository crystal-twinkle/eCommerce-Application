import ElementBuilder from '../../lib/element-builder';
import Span from './span';
import './span.scss';

interface SpanErrorConfig {
  content?: string;
  'data-id': string;
}

export default class SpanError extends Span {
  constructor(config: SpanErrorConfig) {
    super({ class: 'span-error', content: config.content || '' });

    this.builder = new ElementBuilder({
      tag: 'span',
      styleClass: 'span-error',
      content: config.content || '',
    });
    this.builder.setTagSettings({ 'data-id': config['data-id'] });
  }
}
