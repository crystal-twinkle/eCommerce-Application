import './choose-view.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';

export default class ChooseView extends ViewBuilder {
  constructor() {
    super('choose-view');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper choose-view__wrapper');

    const chooseHeading = new ElementBuilder({
      tag: 'h2',
      styleClass: 'choose-view__heading',
      content: 'Why should you choose us?',
    });

    const chooseContent = new ElementBuilder({
      tag: 'div',
      styleClass: 'choose-view__content',
    });

    const paragraphOne = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Скидки постоянным клиентам от 5%',
    });
    const paragraphTwo = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Предлагаем самые выгодные цены',
    });
    const paragraphThree = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Наши покупатели всегда остаются довольны',
    });
    const paragraphFour = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Ширикий ассортимент товаров для всей семьи',
    });
    const paragraphFive = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Возможность доставки в любой город Беларуси ',
    });
    const paragraphSix = new ElementBuilder({
      tag: 'p',
      styleClass: 'choose-view__paragraph',
      content: 'Пункты выдачи заказов рядом с домом',
    });

    chooseContent
      .getElement()
      .append(
        paragraphOne.getElement(),
        paragraphTwo.getElement(),
        paragraphThree.getElement(),
        paragraphFour.getElement(),
        paragraphFive.getElement(),
        paragraphSix.getElement(),
      );

    return [chooseHeading.getElement(), chooseContent.getElement()];
  }
}
