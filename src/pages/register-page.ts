import RegistrationFormView from '../features/authorization/ui/registration-form';
import ViewBuilder from '../shared/lib/view-builder';

export default class RegisterPage extends ViewBuilder {
  constructor() {
    super('page register-page');
  }

  public configureView(): HTMLElement[] {
    const registrationFormView = new RegistrationFormView();

    return [registrationFormView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
