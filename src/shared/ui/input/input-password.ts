import ElementBuilder from '../../lib/element-builder';
import Input from './input';
import validatePassword from '../../lib/validate/validate-password';
import './input-password.scss';

export default class PasswordInput extends Input {
  showButton: ElementBuilder;
  wrapper: ElementBuilder;
  message: ElementBuilder;

  constructor() {
    super({
      type: 'password',
      placeholder: 'Password',
      name: 'password',
    });

    this.showButton = new ElementBuilder({
      tag: 'div',
      styleClass: 'show-password-button',
      event: {
        type: 'click',
        callback: this.showPassword.bind(this),
      },
    });

    this.showCheckingPasswordMessage = this.showCheckingPasswordMessage.bind(this);

    this.builder.setEventHandler({ type: 'input', callback: this.showCheckingPasswordMessage });
    this.builder.setEventHandler({ type: 'input', callback: this.checkPassword.bind(this) });
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

  private showCheckingPasswordMessage() {
    this.message = new ElementBuilder({
      tag: 'span',
      styleClass: 'checking-password-message',
      content: 'weack password',
    });

    this.showButton.getElement().after(this.message.getElement());
  }

  private checkPassword() {
    this.builder.getElement().removeEventListener('input', this.showCheckingPasswordMessage);
    const password = (this.builder.getElement() as HTMLInputElement).value;

    if (!validatePassword(password)) {
      this.showButton.getElement().after(this.message.getElement());
    } else {
      this.message.getElement().remove();
    }
  }
}
