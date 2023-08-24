import ElementBuilder from '../../shared/lib/element-builder';
import { Page } from '../../shared/lib/router/pages';
import './header.scss';
import Button from '../../shared/ui/button/button';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import UserHeaderButton from '../user-header-button/user-header-button';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';

export default class Header extends CommonBuilderWrapper {
  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'header',
      styleClass: 'header',
    });
    const container = new ElementBuilder({
      tag: 'div',
      styleClass: 'container header-container',
    });
    const logo = new ElementBuilder({
      tag: 'img',
      styleClass: 'header__logo',
      event: {
        type: 'click',
        callback: () => appRouter.navigate(Page.OVERVIEW),
      },
      tagSettings: {
        src: '../../assets/icons/logo.svg',
      },
    });
    const navigation = new ElementBuilder({
      tag: 'nav',
    });

    const userHeaderButton = new UserHeaderButton();
    const favoritesButton = new Button({
      callback: () => {},
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      icon: { name: 'heart', position: ButtonIconPosition.LEFT },
      size: ButtonSize.SMALL,
    });
    const cartButton = new Button({
      callback: () => {},
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      icon: { name: 'shopping-bag', position: ButtonIconPosition.LEFT },
      size: ButtonSize.SMALL,
    });
    cartButton.setBadge(4);

    navigation.append([userHeaderButton.getElement(), favoritesButton.getElement(), cartButton.getElement()]);

    // TODO: remove later
    const buttonsContainerBuilder: ElementBuilder = new ElementBuilder({
      tag: 'div',
      styleClass: 'header__buttons',
    });
    const overviewButton = new Button({
      callback: () => appRouter.navigate(Page.OVERVIEW),
      text: 'Main',
      type: ButtonType.DEFAULT_COLORED,
      icon: { name: 'shopping-bag', position: ButtonIconPosition.LEFT },
    });
    const loginButton = new Button({
      callback: () => appRouter.navigate(Page.LOGIN),
      text: 'Login',
      type: ButtonType.DEFAULT_COLORED,
    });
    const logoutButton = new Button({
      callback: () => {
        localStorage.removeItem('customerData');
        localStorage.removeItem('token');
        eventBus.publish(EventBusActions.LOGOUT, {});
      },
      text: 'Logout',
      type: ButtonType.DEFAULT_COLORED,
    });
    const registerButton = new Button({
      callback: () => appRouter.navigate(Page.REGISTRATION),
      text: 'Registration',
      type: ButtonType.DEFAULT_COLORED,
    });
    if (localStorage.getItem('customerData')) {
      buttonsContainerBuilder.append([overviewButton.getElement(), logoutButton.getElement()]);
    } else {
      buttonsContainerBuilder.append([
        overviewButton.getElement(),
        loginButton.getElement(),
        registerButton.getElement(),
      ]);
    }
    eventBus.subscribe(EventBusActions.LOGIN, (data) => {
      buttonsContainerBuilder.setContent();
      buttonsContainerBuilder.append([
        overviewButton.getElement(),
        overviewButton.getElement(),
        logoutButton.getElement(),
      ]);
    });
    eventBus.subscribe(EventBusActions.LOGOUT, () => {
      buttonsContainerBuilder.setContent();
      buttonsContainerBuilder.append([
        overviewButton.getElement(),
        loginButton.getElement(),
        registerButton.getElement(),
      ]);
    });

    container.append([logo.getElement(), buttonsContainerBuilder.getElement(), navigation.getElement()]);

    this.builder.append([container.getElement()]);
  }
}
