import './welcome-view.scss';
import ViewBuilder from '../../shared/lib/view-builder';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';

export default class WelcomeView extends ViewBuilder {
  constructor() {
    super('welcome-view');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper welcome-view__wrapper');

    const contentContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'welcome-view__content-container',
    });

    const welcomeImageFirst = new ElementBuilder({
      tag: 'div',
      styleClass: 'welcome-view__image_first',
    });

    const welcomeImageSecond = new ElementBuilder({
      tag: 'div',
      styleClass: 'welcome-view__image_second',
    });

    const welcomeHeading = new ElementBuilder({
      tag: 'h1',
      styleClass: 'welcome-view__heading',
      content: 'Welcome to ',
    });

    const headingLogo = new ElementBuilder({
      tag: 'span',
      styleClass: 'welcome-view__heading-logo',
      content: 'Cocteil',
    });

    welcomeHeading.append([headingLogo.getElement()]);

    const welcomeText = new ElementBuilder({
      tag: 'p',
      styleClass: 'welcome-view__text',
      content: 'Saving your time!<br>Best prices!<br>The fastest delivery!',
    });

    contentContainer
      .getElement()
      .append(welcomeImageFirst.getElement(), welcomeHeading.getElement(), welcomeText.getElement());

    const welcomeButton = new Button({
      callback: () => {},
      text: 'Catalog',
      type: ButtonType.CIRCLE,
      icon: { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
      size: ButtonSize.BIG,
    });

    welcomeButton.getElement().classList.add('button-container');

    return [contentContainer.getElement(), welcomeImageSecond.getElement(), welcomeButton.getElement()];
  }
}
