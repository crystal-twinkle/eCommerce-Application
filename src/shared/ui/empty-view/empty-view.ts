import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import './empty-view.scss';
import ElementBuilder from '../../lib/element-builder';

export default class EmptyView extends CommonBuilderWrapper {
  constructor(message?: string) {
    super();

    const icon = new ElementBuilder({
      tag: 'img',
      styleClass: 'empty-view__icon',
      tagSettings: {
        src: '../../assets/icons/empty-data.svg',
        alt: 'No data',
      },
    });
    const text = new ElementBuilder({
      tag: 'span',
      styleClass: 'empty-view__message',
      content: message,
    });
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'empty-view',
    });
    this.builder.append([icon.getElement(), text.getElement()]);
  }
}
