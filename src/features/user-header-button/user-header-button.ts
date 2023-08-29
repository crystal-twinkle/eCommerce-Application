import { Customer } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import './user-header-button.scss';
import { Page } from '../../shared/lib/router/pages';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';
import Avatar from '../../shared/ui/avatar/avatar';
import store from '../../app/store';

export default class UserHeaderButton extends CommonBuilderWrapper {
  private readonly POPUP_ID = 'userHeaderButtonPopupId';
  private readonly POPUP_WRAPPER_ID = 'userHeaderButtonPopupWrapperId';

  private headerButton: Button;
  private loginButton: Button;
  private logoutButton: Button;
  private registerButton: Button;
  private user: ElementBuilder;
  private avatar: Avatar;
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
    this.avatar = new Avatar('default-avatar.png', () => {
      appRouter.navigate(Page.USER_PROFILE);
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
        store.setCustomer(null);
        this.logout();
        this.headerButtonClick();
      },
      text: 'Logout',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.registerButton = new Button({
      callback: () => {
        appRouter.navigate(Page.REGISTRATION);
        this.headerButtonClick();
      },
      text: 'Registration',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.popup = new ElementBuilder({
      id: this.POPUP_ID,
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    this.popupWrapper = new ElementBuilder({
      id: this.POPUP_WRAPPER_ID,
      tag: 'div',
      styleClass: 'user-header-button__popup-wrapper',
      event: {
        type: 'click',
        callback: this.headerButtonClick,
      },
    });

    this.builder.append([this.headerButton.getElement()]);

    this.logout();

    eventBus.subscribe(EventBusActions.UPDATE_CUSTOMER, (data) =>
      data ? this.login(data as Customer) : this.logout(),
    );
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
    this.popup.append([this.avatar.getElement(), this.user.getElement(), this.logoutButton.getElement()]);
  };

  public logout = (): void => {
    this.popup.setContent();

    this.avatar = new Avatar('default-avatar.png', () => {});
    this.popup.append([this.avatar.getElement(), this.loginButton.getElement(), this.registerButton.getElement()]);
  };
}
