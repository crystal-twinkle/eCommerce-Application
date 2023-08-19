import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import Avatar from '../../shared/ui/avatar/avatar';
import './user-header-button.scss';

export default class UserHeaderButton extends CommonBuilderWrapper {
  private avatarButton: Button;

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
    const popup = new ElementBuilder({
      tag: 'div',
      styleClass: 'user-header-button__popup',
    });
    const avatar = new Avatar('default-avatar.png', () => {});
    const loginButton = new Button(() => {}, 'Login', ButtonType.DEFAULT_COLORED);

    popup.append([avatar.getElement(), loginButton.getElement()]);
    this.builder.append([this.avatarButton.getElement(), popup.getElement()]);
  }
}
