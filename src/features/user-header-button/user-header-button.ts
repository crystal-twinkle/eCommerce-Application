import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import './user-header-button.scss';
import { Page } from '../../shared/lib/router/pages';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { Customer } from '../../entities/customer/models';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';
import Avatar from '../../shared/ui/avatar/avatar';
import store from '../../app/store';

export default class UserHeaderButton extends CommonBuilderWrapper {
  private avatarButton: Button;
  private loginButton: Button;
  private logoutButton: Button;
  private registerButton: Button;
  private user: ElementBuilder;
  private popup: ElementBuilder;
  private avatar: Avatar;

  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button',
    });
    this.avatarButton = new Button({
      callback: () => {},
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      icon: { name: 'avatar', position: ButtonIconPosition.LEFT },
      size: ButtonSize.SMALL,
      styleClass: 'user-header-button__button',
    });
    this.popup = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    this.avatar = new Avatar('default-avatar.png', () => {});
    this.user = new ElementBuilder({
      tag: 'span',
    });
    this.loginButton = new Button({
      callback: () => appRouter.navigate(Page.LOGIN),
      text: 'Login',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.logoutButton = new Button({
      callback: () => {
        localStorage.removeItem('token_store');
        store.setCustomer(null);
        this.logout();
      },
      text: 'Logout',
      type: ButtonType.DEFAULT_COLORED,
    });
    this.registerButton = new Button({
      callback: () => appRouter.navigate(Page.REGISTRATION),
      text: 'Registration',
      type: ButtonType.DEFAULT_COLORED,
    });

    this.builder.append([this.avatarButton.getElement(), this.popup.getElement()]);

    this.logout();

    eventBus.subscribe(EventBusActions.UPDATE_CUSTOMER, (data) =>
      data ? this.login(data as Customer) : this.logout(),
    );
  }

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
