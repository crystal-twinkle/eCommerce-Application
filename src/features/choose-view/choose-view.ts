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

    const paragraphs = [
      'Скидки постоянным клиентам от 5%',
      'Предлагаем самые выгодные цены',
      'Наши покупатели всегда остаются довольны',
      'Наши покупатели всегда остаются довольны',
      'Ширикий ассортимент товаров для всей семьи',
      'Возможность доставки в любой город Беларуси',
      'Пункты выдачи заказов рядом с домом',
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
