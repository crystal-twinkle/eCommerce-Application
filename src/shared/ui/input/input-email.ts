import Input from './input';

export default class InputEmail extends Input {
  constructor() {
    super({
      type: 'text',
      placeholder: 'Email',
      name: 'email',
    });
    this.showErrorMessage = this.showErrorMessage.bind(this);

    this.builder.setEventHandler({ type: 'input', callback: this.showErrorMessage });
    this.builder.setEventHandler({ type: 'input', callback: this.checkInput.bind(this) });
  }
  public alreadyExistMessage() {
    return this.message.setContent('This email already exist');
  }
  public wrongEmailMessage() {
    return this.message.setContent('Email or password wrong');
  }
  protected showErrorMessage() {
    this.message.setContent('Enter a properly formatted email address (like "example@email.com")');
    this.builder.getElement().after(this.message.getElement());
  }
}
