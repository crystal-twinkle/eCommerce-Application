import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './title.scss';
import ElementBuilder from '../../shared/lib/element-builder';

export default class Title extends CommonBuilderWrapper {
  constructor(title: string, option?: string) {
    super();
    this.builder = new ElementBuilder({
      tag: 'section',
      styleClass: 'title',
    });
    const titleBuilder = new ElementBuilder({
      tag: 'span',
      content: title,
      styleClass: 'title__value',
    });

    this.builder.append([titleBuilder.getElement()]);

    if (option) {
      const optionBuilder = new ElementBuilder({
        tag: 'span',
        content: option,
        styleClass: 'title__value',
      });
      this.builder.append([optionBuilder.getElement()]);
    }
  }
}
