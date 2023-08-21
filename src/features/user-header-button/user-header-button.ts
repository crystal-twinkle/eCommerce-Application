import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import Avatar from '../../shared/ui/avatar/avatar';
import './user-header-button.scss';
import Router from '../../app/router/router';
import { Page } from '../../app/router/pages';

export default class UserHeaderButton extends CommonBuilderWrapper {
  private avatarButton: Button;

  constructor(private router: Router) {
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
    const popup = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    const avatar = new Avatar('default-avatar.png', () => {});
    const loginButton = new Button(() => this.router.navigate(Page.LOGIN), 'Login', ButtonType.DEFAULT_COLORED);
    const registerButton = new Button(
      () => this.router.navigate(Page.REGISTRATION),
      'Registration',
      ButtonType.DEFAULT_COLORED,
    );

    popup.append([avatar.getElement(), loginButton.getElement(), registerButton.getElement()]);
    this.builder.append([this.avatarButton.getElement(), popup.getElement()]);
  }
}
