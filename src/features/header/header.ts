import ElementBuilder from '../../shared/lib/element-builder';
import { Page } from '../../shared/lib/router/pages';
import './header.scss';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import UserHeaderButton from '../user-header-button/user-header-button';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';

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
    const favoritesButton = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'heart', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
    );
    const cartButton = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'shopping-bag', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
    );
    cartButton.setBadge(4);

    navigation.append([userHeaderButton.getElement(), favoritesButton.getElement(), cartButton.getElement()]);

    // TODO: remove later
    const buttonsContainerBuilder: ElementBuilder = new ElementBuilder({
      tag: 'div',
      styleClass: 'header__buttons',
    });
    const overviewButton = new Button(() => appRouter.navigate(Page.OVERVIEW), 'Main', ButtonType.DEFAULT_COLORED);
    const loginButton = new Button(() => appRouter.navigate(Page.LOGIN), 'Login', ButtonType.DEFAULT_COLORED);
    const productButton = new Button(() => appRouter.navigate(Page.PRODUCT), 'product', ButtonType.DEFAULT_COLORED);
    const logoutButton = new Button(
      () => {
        localStorage.removeItem('customerData');
        localStorage.removeItem('token');
        eventBus.publish(EventBusActions.LOGOUT, {});
      },
      'Logout',
      ButtonType.DEFAULT_COLORED,
    );
    const registerButton = new Button(
      () => appRouter.navigate(Page.REGISTRATION),
      'Registration',
      ButtonType.DEFAULT_COLORED,
    );
    if (localStorage.getItem('customerData')) {
      buttonsContainerBuilder.append([overviewButton.getElement(), logoutButton.getElement()]);
    } else {
      buttonsContainerBuilder.append([
        overviewButton.getElement(),
        loginButton.getElement(),
        registerButton.getElement(),
        productButton.getElement(),
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
