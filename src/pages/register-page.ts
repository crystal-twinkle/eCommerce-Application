import ElementBuilder from '../shared/lib/element-builder';
import registrationForm from '../features/authorization/ui/registration-form';
import requestMessage from '../features/authorization/ui/request-message';
import tooltipsCard from '../features/authorization/ui/tooltips-card';

export default class RegisterPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: 'Register Page',
    });

    this.builder.append([registrationForm, requestMessage, tooltipsCard]);
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
