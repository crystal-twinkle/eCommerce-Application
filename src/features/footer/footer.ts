import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';
import './footer.scss';

export default class Footer extends ViewBuilder {
  footer: ElementBuilder;

  constructor() {
    super('footer', 'footer');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper footer__wrapper');

    const footerBlock = new ElementBuilder({
      tag: 'div',
      styleClass: 'footer__content-block',
    });

    const blockHeading = new ElementBuilder({
      tag: 'h3',
      styleClass: 'footer__block-heading',
      content: 'Information',
    });

    footerBlock.getElement().append(blockHeading.getElement());
    return [footerBlock.getElement()];
  }
}
