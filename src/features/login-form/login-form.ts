import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import '../authorization/ui/tooltip.scss';
import customer from '../../entities/api/customer';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../authorization/lib/check-validaror';
import requestMessage, { requestMessageText } from '../authorization/ui/request-message';
import blackout from '../blackout/blackout';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import { Customer } from '../../entities/customer/customer';

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
        if (checkValidator([emailLogin.getElement(), passwordLogin])) {
          const result = await customer().login(emailLogin.getElement().value, passwordLogin.value);
          if (result.statusCode !== 400) {
            const customerData: Customer = (result as { customer: Customer }).customer;
            localStorage.setItem('customerData', JSON.stringify(customerData));
            eventBus.publish(EventBusActions.LOGIN, { customer: customerData });
            requestMessageText.textContent = 'You are logged in!';
            requestMessage.style.display = 'block';
            blackout.classList.add('blackout_show');
            appRouter.navigate(Page.OVERVIEW);
          } else {
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
