import './collaboration-view.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import ViewBuilder from '../../shared/lib/view-builder';

export default class CollaborationView extends ViewBuilder {
  constructor() {
    super('collaboration-view');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper collaboration-view__wrapper');

    const collaborationHeading = new ElementBuilder({
      tag: 'h2',
      styleClass: 'collaboration-view__heading',
      content: 'Collaboration',
    });

    const collaborationText = new ElementBuilder({
      tag: 'p',
      styleClass: 'collaboration-view__text',
      content:
        'Наша компания постоянно растёт и расширяет рынок, поэтому мы заинтересованы вновых партнёрах и рассматриваем новые проекты, которые могут быть привлекательны и интересны с коммерческой точки зрения. ',
    });

    const collaborationContent = new ElementBuilder({
      tag: 'div',
      styleClass: 'collaboration-view__content',
    });

    const textItems = [
      {
        heading: 'Становитесь партнёром',
        text: 'Регистрируйтесь и переходите в свой кабинет',
      },
      {
        heading: 'Рекламируйте товары',
        text: 'Рекламируйте наши товары на форумах, сайтах, в социальных сетях',
      },
      {
        heading: 'Приводите покупателей',
        text: 'Приводите покупателей на наш сайт по уникальной ссылке',
      },
      {
        heading: 'Получайте бонусы',
        text: 'Копите бонусы от каждого оплаченного заказа',
      },
    ];

    textItems.forEach((item) => {
      const textItem = new ElementBuilder({
        tag: 'div',
        styleClass: 'collaboration-view__text-item',
      });

      const heading = new ElementBuilder({
        tag: 'h3',
        styleClass: 'collaboration-view__item-heading',
        content: `${item.heading}`,
      });

      const text = new ElementBuilder({
        tag: 'p',
        styleClass: 'collaboration-view__item-text',
        content: `${item.text}`,
      });

      textItem.getElement().append(heading.getElement(), text.getElement());
      collaborationContent.getElement().append(textItem.getElement());
    });

    const subheading = new ElementBuilder({
      tag: 'h2',
      styleClass: 'collaboration-view__subheading',
      content: "It 's advantageous. What are the benefits?",
    });

    const benefitsContent = new ElementBuilder({
      tag: 'div',
      styleClass: 'collaboration-view__benefits-content',
    });

    const benefitsData = [
      {
        iconLink: './src/shared/assets/icons/logo.svg',
        text: 'Automation of processes',
      },
      {
        iconLink: '',
        text: 'Expanding the assortment',
      },
      {
        iconLink: '',
        text: 'Support and training',
      },
      {
        iconLink: '',
        text: 'Bonuses for new clients',
      },
    ];

    benefitsData.forEach((item) => {
      const benefitsItem = new ElementBuilder({
        tag: 'div',
        styleClass: 'benefits-content__item',
      });

      const icon = new ElementBuilder({
        tag: 'img',
        styleClass: 'benefits-content__icon',
        tagSettings: { src: `${item.iconLink}`, alt: `${item.text}-icon` },
      });

      const text = new ElementBuilder({
        tag: 'p',
        styleClass: 'benefits-content__text',
        content: `${item.text}`,
      });

      benefitsItem.getElement().append(icon.getElement(), text.getElement());
      benefitsContent.getElement().append(benefitsItem.getElement());
    });

    return [
      collaborationHeading.getElement(),
      collaborationText.getElement(),
      collaborationContent.getElement(),
      subheading.getElement(),
      benefitsContent.getElement(),
    ];
  }
}
