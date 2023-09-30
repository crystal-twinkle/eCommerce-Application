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
        'Our company is in a constant state of growth and market expansion. As a result, we are actively seeking new partners and evaluating fresh projects that hold commercial appeal and interest',
    });

    const collaborationContent = new ElementBuilder({
      tag: 'div',
      styleClass: 'collaboration-view__content',
    });

    const textItems = [
      {
        heading: 'Become a partner',
        text: 'Register and proceed to your account',
      },
      {
        heading: 'Promote products',
        text: 'Promote our products on forums, websites, and social media platforms.',
      },
      {
        heading: 'Bring in customers',
        text: 'Bring customers to our website through a unique link',
      },
      {
        heading: 'Receive bonuses',
        text: 'Accumulate bonuses from every paid order',
      },
    ];

    textItems.forEach((item) => {
      const textItem = new ElementBuilder({
        tag: 'div',
        styleClass: 'collaboration-view__content-item',
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
      tag: 'h3',
      styleClass: 'collaboration-view__subheading',
      content: "It 's advantageous. What are the benefits?",
    });

    const benefitsContent = new ElementBuilder({
      tag: 'div',
      styleClass: 'collaboration-view__content',
    });

    const benefitsData = [
      {
        iconLink: '/../../assets/icons/automation-of-processes.svg',
        text: 'Automation of processes',
      },
      {
        iconLink: '/../../assets/icons/expanding-the-assortment.svg',
        text: 'Expanding the assortment',
      },
      {
        iconLink: '/../../assets/icons/support-and-training.svg',
        text: 'Support and training',
      },
      {
        iconLink: '/../../assets/icons/bonuses-for-new-clients.svg',
        text: 'Bonuses for new clients',
      },
    ];

    benefitsData.forEach((item) => {
      const benefitsItem = new ElementBuilder({
        tag: 'div',
        styleClass: 'collaboration-view__content-item',
      });

      const icon = new ElementBuilder({
        tag: 'img',
        styleClass: 'benefits-content__item-icon',
        tagSettings: { src: `${item.iconLink}`, alt: `${item.text}-icon` },
      });

      const text = new ElementBuilder({
        tag: 'p',
        styleClass: 'collaboration-view__item-text',
        content: `${item.text}`,
      });

      benefitsItem.getElement().append(icon.getElement(), text.getElement());
      benefitsContent.getElement().append(benefitsItem.getElement());
    });

    const forPromocode = new ElementBuilder({
      tag: 'div',
      styleClass: 'collaboration-view__promocode',
      content: 'Active promo code: emp15',
    });

    return [
      collaborationHeading.getElement(),
      collaborationText.getElement(),
      collaborationContent.getElement(),
      subheading.getElement(),
      benefitsContent.getElement(),
      forPromocode.getElement(),
    ];
  }
}
