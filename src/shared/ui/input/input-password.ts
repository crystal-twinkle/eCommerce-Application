import ElementBuilder from '../../lib/element-builder';
import Input from './input';
import './input-password.scss';
import validatePassword from '../../lib/validate/validate-password';

export default class PasswordInput extends Input {
  showButton: ElementBuilder;

  constructor() {
    super(
      {
        type: 'password',
        placeholder: 'Password',
        name: 'password',
      },
      'weack password',
      validatePassword,
    );

    this.showButton = new ElementBuilder({
      tag: 'div',
      styleClass: 'show-password-button',
      event: {
        type: 'click',
        callback: this.showPassword.bind(this),
      },
    });
  }

  public addShowButton() {
    this.builder.getElement().after(this.showButton.getElement());
  }

  private showPassword(): void {
    const type = this.builder.getElement().getAttribute('type') === 'password' ? 'text' : 'password';
    this.builder.setTagSettings({ type });
    this.showButton.getElement().classList.toggle('show-password-button_hidden');
    this.builder.getElement().focus();
  }
}
