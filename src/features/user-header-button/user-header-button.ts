import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import Avatar from '../../shared/ui/avatar/avatar';
import './user-header-button.scss';
import { Page } from '../../shared/lib/router/pages';
import appRouter from '../../shared/lib/router/router';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { Customer } from '../../entities/customer/models';

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
    this.avatarButton = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'avatar', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
      'user-header-button__button',
    );
    this.popup = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    this.avatar = new Avatar('default-avatar.png', () => {});
    this.user = new ElementBuilder({
      tag: 'span',
    });
    this.loginButton = new Button(() => appRouter.navigate(Page.LOGIN), 'Login', ButtonType.DEFAULT_COLORED);
    this.logoutButton = new Button(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerData');
        eventBus.publish(EventBusActions.LOGOUT, {});
      },
      'Logout',
      ButtonType.DEFAULT_COLORED,
    );
    this.registerButton = new Button(
      () => appRouter.navigate(Page.REGISTRATION),
      'Registration',
      ButtonType.DEFAULT_COLORED,
    );

    if (localStorage.getItem('customerData')) {
      this.login(JSON.parse(localStorage.getItem('customerData')) as Customer);
    } else {
      this.logout();
    }

    this.builder.append([this.avatarButton.getElement(), this.popup.getElement()]);

    eventBus.subscribe(EventBusActions.LOGIN, (data) =>
      this.login((data as { customer: Customer }).customer as Customer),
    );
    eventBus.subscribe(EventBusActions.LOGOUT, () => this.logout());
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
