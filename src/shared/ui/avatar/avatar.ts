import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import ElementBuilder from '../../lib/element-builder';
import './avatar.scss';

export default class Avatar extends CommonBuilderWrapper {
  constructor(image: string, callback: () => void) {
    super();

    this.builder = new ElementBuilder({
      tag: 'img',
      styleClass: 'avatar',
      tagSettings: {
        src: `../../assets/${image}`,
        alt: 'avatar',
      },
      event: {
        type: 'click',
        callback,
      },
    });
  }
}
