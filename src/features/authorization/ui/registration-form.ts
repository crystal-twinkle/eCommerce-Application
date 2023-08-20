import Input from '../../../shared/ui/input/input';
import inputEmail from '../../../shared/ui/input/input-email';
import PasswordInput from '../../../shared/ui/input/input-password';
import validateAge from '../../../shared/lib/validate/validate-age';
import countryDropdown from './country-dropdown';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import notEmpty from '../../../shared/lib/validate/not-empty';
import validatePostalCode from '../../../shared/lib/validate/validate-postal-code';
import ViewBuilder from '../../../shared/lib/view-builder';

export default class RegistrationFormView extends ViewBuilder {
  constructor() {
    super('registration-form');
  }

  public configureView(): HTMLElement[] {
    const emailReg = inputEmail.getElement();
    const passwordReg = new PasswordInput();
    const firstName = new Input(
      {
        placeholder: 'First Name',
        name: 'firstName',
      },
      'invalid first name',
      notEmpty,
    ).getElement();

    const lastName = new Input(
      {
        placeholder: 'Last Name',
        name: 'lastName',
      },
      'invalid last name',
      notEmpty,
    ).getElement();

    const city = new Input(
      {
        placeholder: 'City',
        name: 'city',
      },
      'invalid city',
      notEmpty,
    ).getElement();

    const street = new Input(
      {
        placeholder: 'Street',
        name: 'street',
      },
      'invalid street',
      notEmpty,
    ).getElement();

    const pCode = new Input(
      {
        placeholder: 'PostalCode',
        name: 'postalCode',
      },
      'invalid postalCode',
      validatePostalCode,
    ).getElement();

    const dob = new Input(
      {
        type: 'date',
        name: 'dob',
      },
      'invalid age',
      validateAge,
    ).getElement();

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
