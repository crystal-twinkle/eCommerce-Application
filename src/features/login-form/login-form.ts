import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../../shared/lib/validate/check-validaror';
import requestMessage, { requestMessageText } from '../authorization/ui/request-message';
import blackout from '../blackout/blackout';
import flowFactory from '../../app/api-flow/flow-factory';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import store from '../../app/store';

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
          // try {
          flowFactory.createPasswordFlow(emailLogin.getElement().value, passwordLogin.value);
          const result = await flowFactory.passwordFlow
            .me()
            .login()
            .post({
              body: {
                email: emailLogin.getElement().value,
                password: passwordLogin.value,
              },
            })
            .execute();
          store.setCustomer(result.body.customer);
          requestMessageText.textContent = 'You are logged in!';
          requestMessage.style.display = 'block';
          blackout.classList.add('blackout_show');
          appRouter.navigate(Page.OVERVIEW);
          // } catch (e) {
          emailLogin.getElement().classList.add('input_invalid');
          emailLogin.wrongEmailMessage();
          // }
        }
      },
    });
    passwordLoginClass.addShowButton();

    return [loginForm.getElement()];
  }
}
