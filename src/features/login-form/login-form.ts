import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';
import customer from '../../entities/api/customer';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../authorization/lib/check-validaror';

export default class LoginForm extends ViewBuilder {
  constructor() {
    super('login-form');
  }

  public configureView() {
    const emailLoginClass = new InputEmail();
    const emailLogin = emailLoginClass.getElement();
    const passwordLoginClass = new PasswordInput();
    const passwordLogin = passwordLoginClass.getElement();

    const loginForm = new Form({
      title: 'Login',
      id: 'login',
      fields: [emailLogin, passwordLogin],
      buttons: [
        { text: 'Submit' },
        {
          text: 'Registration',
          callback: () => appRouter.navigate(Page.REGISTRATION),
        },
      ],
      callback: async (event) => {
        event.preventDefault();
        if (checkValidator([emailLogin, passwordLogin])) {
          const result = await customer().getByEmail(emailLogin.value);
          if (result.results.length && passwordLogin.value === localStorage.getItem('password')) {
            appRouter.navigate(Page.OVERVIEW);
          }
        }
      },
    });
    passwordLoginClass.addShowButton();

    return [loginForm.getElement()];
  }
}
