import './choose-view.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';

export default class ChooseView extends ViewBuilder {
  constructor() {
    super('choose-view');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper choose-view__wrapper');

    const heading = new ElementBuilder({
      tag: 'h2',
      styleClass: 'choose-view__heading',
      content: 'Why should you choose us?',
    });

    const content = new ElementBuilder({
      tag: 'div',
      styleClass: 'choose-view__content',
    });

    const paragraphs: string[] = [
      'Loyal customers enjoy discounts starting from 5%',
      'We offer the most competitive prices',
      'Our customers are always happy with their experience',
      'Extensive range of products for the entire family',
      'Delivery available across the USA and Canada',
      'Order pickup points near your home.',
    ];

    paragraphs.forEach((paragraph) => {
      const item = new ElementBuilder({
        tag: 'p',
        styleClass: 'choose-view__paragraph',
        content: paragraph,
      });
      content.getElement().append(item.getElement());
    });

    return [heading.getElement(), content.getElement()];
  }
}
