import inputEmailBuild from '../../shared/ui/input/input-email';
import inputPasswordBuild from '../../shared/ui/input/input-password';
import checkValidator from '../authorization/lib/check-validaror';
import Form from '../../shared/ui/form/form';
import '../authorization/ui/tooltip.scss';
import ViewBuilder from '../../shared/lib/view-builder';

export default class LoginForm extends ViewBuilder {
  constructor() {
    super('login-form');
  }

  public configureView(): HTMLElement[] {
    const emailReg = inputEmailBuild.getElement();
    const passwordReg = inputPasswordBuild.getElement();

    const registrationForm = new Form({
      title: 'Login',
      id: 'login',
      fields: [emailReg, passwordReg],
      buttons: [{ text: 'Submit' }],
      callback: (event) => {
        event.preventDefault();
        if (checkValidator([emailReg, passwordReg])) {
          console.log("It's ok");
        }
      },
    });

    return [registrationForm.getElement()];
  }
}
