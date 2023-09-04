import RegistrationFormView from '../features/authorization/registration-form';
import ViewBuilder from '../shared/lib/view-builder';

export default class RegisterPage extends ViewBuilder {
  constructor() {
    super('page form-page');
  }

  public configureView(): HTMLElement[] {
    const registrationFormView = new RegistrationFormView();

    return [registrationFormView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
