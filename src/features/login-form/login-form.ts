import InputEmail from '../../shared/ui/input/input-email';
import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';

export default class LoginForm extends ViewBuilder {
  constructor() {
    super('login-form');
  }

  public configureView() {
    const emailReg = new InputEmail().getElement();
    const passwordReg = new PasswordInput();

    const loginForm = new Form({
      title: 'Login',
      id: 'login',
      fields: [emailReg, passwordReg.getElement()],
      buttons: [
        { text: 'Submit' },
        {
          text: 'Registration',
          callback: () => appRouter.navigate(Page.REGISTRATION),
        },
      ],
      callback: (event) => {
        event.preventDefault();
      },
    });
    passwordReg.addShowButton();

    return [loginForm.getElement()];
  }
}
