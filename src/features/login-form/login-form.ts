import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../../shared/lib/validate/check-validaror';
import flowFactory from '../../app/api-flow/flow-factory';
import store from '../../app/store';
import RequestMessage from '../authorization/ui/request-message';

export default class LoginForm extends ViewBuilder {
  constructor() {
    super('login-form');
  }

  public configureView() {
    const emailLogin = new InputEmail();
    const passwordLoginClass = new PasswordInput();
    const passwordLogin = passwordLoginClass.getElement();

    const loginForm = new Form({
      title: 'Login',
      id: 'login',
      fields: [emailLogin.getElement(), passwordLogin],
      buttons: [
        { text: 'Submit' },
        {
          text: 'Registration',
          callback: () => appRouter.navigate(Page.REGISTRATION),
        },
      ],
      callback: async (event) => {
        event.preventDefault();
        if ([emailLogin.getElement(), passwordLogin].every((elem) => checkValidator(elem))) {
          try {
            flowFactory.createPasswordFlow(emailLogin.getElement().value, passwordLogin.value);
            const result = await flowFactory.passwordFlow
              .me()
              .login()
              .post({ body: { email: emailLogin.getElement().value, password: passwordLogin.value } })
              .execute();
            store.setCustomer(result.body.customer);

            new RequestMessage().logSuccess();
            appRouter.navigate(Page.OVERVIEW);
          } catch (e) {
            if (e.toString() === 'Error: Customer account with the given credentials not found.') {
              emailLogin.getElement().classList.add('input_invalid');
              emailLogin.wrongEmailMessage();
            } else {
              new RequestMessage().badResult();
            }
          }
        }
      },
    });
    passwordLoginClass.addShowButton();

    return [loginForm.getElement()];
  }
}
