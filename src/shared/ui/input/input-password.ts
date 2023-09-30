import ElementBuilder from '../../lib/element-builder';
import Input from './input';
import './input-password.scss';

export default class PasswordInput extends Input {
  showButton: ElementBuilder;

  constructor(placeholder?: string) {
    super({
      type: 'password',
      placeholder: placeholder || 'Password',
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
    setTimeout(this.addShowButton.bind(this), 0);
  }

  public addShowButton(): void {
    const input = this.builder.getElement();
    input.parentNode.insertBefore(this.showButton.getElement(), input);
  }

  private showPassword(): void {
    const type = this.builder.getElement().getAttribute('type') === 'password' ? 'text' : 'password';
    this.builder.setTagSettings({ type });
    this.showButton.getElement().classList.toggle('show-password-button_hidden');
    this.builder.getElement().focus();
  }
}
