import inputEmailBuild from '../../shared/ui/input/input-email';
import checkValidator from '../authorization/lib/check-validaror';
import Form from '../../shared/ui/form/form';
import ViewBuilder from '../../shared/lib/view-builder';
import PasswordInput from '../../shared/ui/input/input-password';
import '../authorization/ui/tooltip.scss';

export default class LoginForm extends ViewBuilder {
  constructor() {
    super('login-form');
  }

  public configureView(): HTMLElement[] {
    const emailReg = inputEmailBuild.getElement();
    const passwordReg = new PasswordInput();

    const registrationForm = new Form({
      title: 'Login',
      id: 'login',
      fields: [emailReg, passwordReg.getElement()],
      buttons: [{ text: 'Submit' }],
      callback: (event) => {
        event.preventDefault();
        if (checkValidator([emailReg, passwordReg.getElement()])) {
          console.log("It's ok");
        }
      },
    });
    passwordReg.addShowButton();

    return [registrationForm.getElement()];
  }
}
