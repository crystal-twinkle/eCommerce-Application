import Input from '../../../shared/ui/input/input';
import inputEmail from '../../../shared/ui/input/input-email';
import PasswordInput from '../../../shared/ui/input/input-password';
import countryDropdown from './country-dropdown';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import ViewBuilder from '../../../shared/lib/view-builder';
import InputPostalCode from '../../../shared/ui/input/input-postal-code';

export default class RegistrationFormView extends ViewBuilder {
  constructor() {
    super('registration-form');
  }

  public configureView(): HTMLElement[] {
    const emailReg = inputEmail.getElement();
    const passwordReg = new PasswordInput();
    const firstName = new Input({
      placeholder: 'First Name',
      name: 'firstName',
    }).getElement();

    const lastName = new Input({
      placeholder: 'Last Name',
      name: 'lastName',
    }).getElement();

    const city = new Input({
      placeholder: 'City',
      name: 'city',
    }).getElement();

    const street = new Input({
      placeholder: 'Street',
      name: 'street',
    }).getElement();

    const pCode = new InputPostalCode().getElement();

    const dob = new Input({
      type: 'date',
      name: 'dob',
    }).getElement();

    const registrationForm = new Form({
      title: 'Registration',
      id: 'form-registration',
      fields: [
        emailReg,
        passwordReg.getElement(),
        firstName,
        lastName,
        countryDropdown.getElement(),
        dob,
        city,
        street,
        pCode,
      ],
      buttons: [{ text: 'Submit' }],
      callback: (event) => {
        event.preventDefault();
      },
    });
    passwordReg.addShowButton();

    return [registrationForm.getElement()];
  }
}
