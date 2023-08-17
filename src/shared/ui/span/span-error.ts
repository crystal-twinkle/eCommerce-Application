import Span from './span';
import './span.scss';

interface SpanErrorConfig {
  'data-id': string;
  content: string;
}

export default class SpanError extends Span {
  constructor(config: SpanErrorConfig) {
    super({ class: 'span-error', content: config.content });
    this.builder.setTagSettings({ 'data-id': config['data-id'] });
  }
}
