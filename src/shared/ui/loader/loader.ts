import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import ElementBuilder from '../../lib/element-builder';
import './loader.scss';

export default class Loader extends CommonBuilderWrapper {
  constructor(styleClass: string = '') {
    super();
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: `loader ${styleClass}`,
    });
    this.builder.append([
      ...new Array<null>(8).fill(null).map(() =>
        new ElementBuilder({
          tag: 'div',
        }).getElement(),
      ),
    ]);
  }

  set visible(v: boolean) {
    v ? this.builder.removeStyleClass('_hide') : this.builder.addStyleClass('_hide');
  }
}
