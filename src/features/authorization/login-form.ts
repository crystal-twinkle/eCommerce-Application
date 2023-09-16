import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import InputEmail from '../../shared/ui/input/input-email';
import checkValidator from '../../shared/lib/validate/check-validaror';
import flowFactory from '../../app/api-flow/flow-factory';
import store from '../../app/store';
import RequestMessage from '../request-message/request-message';
import CartApi from '../../entities/cart/cart-api';

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
            if (result.statusCode === 200) {
              store.setUser(result.body.customer);
              if (localStorage.getItem('cartID')) {
                await CartApi.setCustomerID(result.body.customer.id);
                //   await CartApi.mergeCarts()
                //     .then((data) => console.log(data))
                //     .catch((e) => console.log(e));
              }
              new RequestMessage().logSuccess();
              appRouter.navigate(Page.OVERVIEW);
            }
          } catch (e) {
            emailLogin.getElement().classList.add('input_invalid');
            emailLogin.wrongEmailMessage();
          }
        }
      },
    });

    return [loginForm.getElement()];
  }
}
