import Input from '../../../shared/ui/input/input';
import PasswordInput from '../../../shared/ui/input/input-password';
import countryDropdown from './country-dropdown';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import ViewBuilder from '../../../shared/lib/view-builder';
import InputPostalCode from '../../../shared/ui/input/input-postal-code';
import customer, { addressesCreate } from '../../../entities/api/customer';
import ElementBuilder from '../../../shared/lib/element-builder';
import { resultsCheckbox, resultCreateCustomer, resultGetCustomer } from '../lib/result-request';
import checkValidator from '../lib/check-validaror';

export default class RegistrationFormView extends ViewBuilder {
  constructor() {
    super('registration-form');
  }

  public configureView(): HTMLElement[] {
    const emailReg = new Input({ placeholder: 'Email', name: 'email' }).getElement();
    const passwordReg = new PasswordInput();

    const firstName = new Input({
      placeholder: 'First Name',
      name: 'firstName',
    }).getElement();

    const lastName = new Input({
      placeholder: 'Last Name',
      name: 'lastName',
    }).getElement();

    const shipAddress = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__address',
    }).getElement();

    const shipTitle = new ElementBuilder({ tag: 'h4', content: 'Shipping Address' }).getElement();

    const shipCity = new Input({
      placeholder: 'City',
      name: 'city',
    }).getElement();

    const shipStreet = new Input({
      placeholder: 'Street',
      name: 'street',
    }).getElement();

    const shipPCode = new InputPostalCode().getElement();

    const shipDefault = new ElementBuilder({
      tag: 'div',
    }).getElement();

    const shipDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

    const shipDefaultText = new ElementBuilder({
      tag: 'span',
      content: 'Set as default address',
    }).getElement();
    shipDefault.append(shipDefaultCheckbox, shipDefaultText);

    const shipAsBill = new ElementBuilder({
      tag: 'div',
    }).getElement();
    const shipAsBillCheckbox = new Input({ type: 'checkbox' }).getElement();
    shipAsBillCheckbox.checked = true;

    const shipAsBillText = new ElementBuilder({
      tag: 'span',
      content: 'Also use as billing address',
    }).getElement();
    shipAsBill.append(shipAsBillCheckbox, shipAsBillText);

    shipAddress.append(shipTitle, shipCity, shipStreet, shipPCode, shipDefault, shipAsBill);

    const billAddress = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__address',
    }).getElement();

    const billTitle = new ElementBuilder({ tag: 'h4', content: 'Billing Address' }).getElement();
    const billCity = new Input({
      placeholder: 'City',
      name: 'city',
    }).getElement();
    billAddress.style.display = 'none';
    const billStreet = new Input({
      placeholder: 'Street',
      name: 'street',
    }).getElement();
    const billPCode = new InputPostalCode().getElement();

    const billDefault = new ElementBuilder({
      tag: 'div',
    }).getElement();
    const billDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

    const billDefaultText = new ElementBuilder({
      tag: 'span',
      content: 'Set as default address',
    }).getElement();
    billDefault.append(billDefaultCheckbox, billDefaultText);

    billAddress.append(billTitle, billCity, billStreet, billPCode, billDefault);

    const dob = new Input({
      type: 'date',
      name: 'dob',
    }).getElement();

    shipDefaultCheckbox.addEventListener('change', () => {
      resultsCheckbox.shipDefaultCheck = shipDefaultCheckbox.checked;
    });

    shipAsBillCheckbox.addEventListener('change', () => {
      if (shipAsBillCheckbox.checked) {
        billAddress.style.display = 'none';
      } else {
        billAddress.style.display = 'flex';
      }
      resultsCheckbox.shipAsBillCheck = shipAsBillCheckbox.checked;
      resultsCheckbox.billDefaultCheck = false;
    });

    billDefaultCheckbox.addEventListener('change', () => {
      resultsCheckbox.billDefaultCheck = billDefaultCheckbox.checked;
    });

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
        shipAddress,
        billAddress,
      ],

      buttons: [{ text: 'Submit' }, { text: 'Sign in' }],
      callback: async (event) => {
        event.preventDefault();
        let checkValid = false;
        [emailReg, passwordReg.getElement(), firstName, lastName, shipCity, shipStreet, shipPCode].forEach((elem) => {
          checkValid = checkValidator(elem);
        });

        if (!resultsCheckbox.shipAsBillCheck) {
          [billCity, billStreet, billPCode].forEach((elem) => {
            checkValid = checkValidator(elem);
          });
        }
        if (checkValid) {
          addressesCreate.length = 0;
          await customer().addAddress([
            emailReg.value,
            firstName.value,
            lastName.value,
            shipPCode.value,
            shipCity.value,
            shipStreet.value,
          ]);
          if (!resultsCheckbox.shipAsBillCheck) {
            await customer().addAddress([
              emailReg.value,
              firstName.value,
              lastName.value,
              billPCode.value,
              billPCode.value,
              billPCode.value,
            ]);
          }
          const resultCreate = await customer().create(
            emailReg.value,
            passwordReg.getElement().value,
            firstName.value,
            lastName.value,
          );
          await resultCreateCustomer(resultCreate, emailReg);
          if (resultCreate.customer) {
            await resultGetCustomer(resultCreate.customer.id);
          }
        }
      },
    });

    passwordReg.addShowButton();

    return [registrationForm.getElement()];
  }
}
