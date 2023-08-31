import { Customer } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import './user-header-button.scss';
import { Page } from '../../shared/lib/router/pages';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';
import store from '../../app/store';

export default class UserHeaderButton extends CommonBuilderWrapper {
  private readonly POPUP_ID = 'userHeaderButtonPopupId';
  private readonly POPUP_WRAPPER_ID = 'userHeaderButtonPopupWrapperId';

  private headerButton: Button;
  private loginButton: Button;
  private logoutButton: Button;
  private registerButton: Button;
  private privateAccountButton: Button;
  private user: ElementBuilder;
  private popup: ElementBuilder;
  private popupWrapper: ElementBuilder;
  private opened: boolean;

  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button',
    });
    this.headerButton = new Button({
      callback: this.headerButtonClick,
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      icon: { name: 'avatar', position: ButtonIconPosition.LEFT },
      size: ButtonSize.SMALL,
      styleClass: 'user-header-button__button',
    });
    this.user = new ElementBuilder({
      tag: 'span',
    });
    this.loginButton = new Button({
      callback: () => {
        appRouter.navigate(Page.LOGIN);
        this.headerButtonClick();
      },
      text: 'Login',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.logoutButton = new Button({
      callback: () => {
        localStorage.removeItem('token_store');
        store.setUser(null);
        this.logout();
        this.headerButtonClick();
      },
      styleClass: 'user-header-button__popup-button',
      text: 'Logout',
      icon: {
        name: 'exit',
        position: ButtonIconPosition.LEFT,
      },
      type: ButtonType.DEFAULT_WITHOUT_BORDER,
    });
    this.registerButton = new Button({
      callback: () => {
        appRouter.navigate(Page.REGISTRATION);
        this.headerButtonClick();
      },
      text: 'Registration',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.privateAccountButton = new Button({
      callback: () => {
        appRouter.navigate(Page.USER_PROFILE);
        this.headerButtonClick();
      },
      styleClass: 'user-header-button__popup-button',
      icon: {
        name: 'avatar',
        position: ButtonIconPosition.LEFT,
      },
      text: 'Private Account',
      type: ButtonType.DEFAULT_WITHOUT_BORDER,
    });

    this.popup = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    this.popupWrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup-wrapper',
      event: {
        type: 'click',
        callback: this.headerButtonClick,
      },
    });

    this.builder.append([this.headerButton.getElement()]);

    this.logout();

    eventBus.subscribe(EventBusActions.UPDATE_USER, (data) => (data ? this.login(data as Customer) : this.logout()));
  }

  private headerButtonClick = (): void => {
    this.opened = !this.opened;
    if (this.opened) {
      this.builder.append([this.popup.getElement(), this.popupWrapper.getElement()]);
    } else {
      this.builder.setContent();
      this.builder.append([this.headerButton.getElement()]);
    }
  };

  public login = (data: Customer): void => {
    this.popup.setContent();
    this.user.setContent(data.firstName);
    this.popup.append([this.user.getElement(), this.privateAccountButton.getElement(), this.logoutButton.getElement()]);
  };

  public logout = (): void => {
    this.popup.setContent();
    this.popup.append([this.loginButton.getElement(), this.registerButton.getElement()]);
  };
}
