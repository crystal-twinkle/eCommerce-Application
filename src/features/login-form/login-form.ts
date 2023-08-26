import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../../shared/lib/validate/check-validaror';
import RequestMessage from '../authorization/ui/request-message';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { Customer } from '../../entities/customer/models';
import apiRoot from '../../app/client-builder/api-root';

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
            const result = await apiRoot
              .me()
              .login()
              .post({
                body: {
                  email: emailLogin.getElement().value,
                  password: passwordLogin.value,
                },
              })
              .execute();
            const customerData: Customer = (result as { customer: Customer }).customer;
            eventBus.publish(EventBusActions.LOGIN, { customer: customerData });
            new RequestMessage().logSuccess();
            appRouter.navigate(Page.OVERVIEW);
          } catch (e) {
            emailLogin.getElement().classList.add('input_invalid');
            emailLogin.wrongEmailMessage();
          }
        }
      },
    });
    passwordLoginClass.addShowButton();

    return [loginForm.getElement()];
  }
}
