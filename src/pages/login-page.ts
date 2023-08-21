import LoginForm from '../features/login-form/login-form';
import ViewBuilder from '../shared/lib/view-builder';

export default class LoginPage extends ViewBuilder {
  constructor() {
    super('page login-page');
  }

  public configureView(): HTMLElement[] {
    const loginFormView = new LoginForm();

    return [loginFormView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
