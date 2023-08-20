import Input from '../../../shared/ui/input/input';
import validateAge from '../../../shared/lib/validate/validate-age';
import countryDropdown from './country-dropdown';
import checkValidator from '../lib/check-validaror';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import customer from '../../../entities/api/customer';
import ElementBuilder from '../../../shared/lib/element-builder';
import { resultCreateCustomer, resultGetCustomer, resultsCheckbox } from '../lib/result-request';

const emailReg = new Input({
  type: 'email',
  placeholder: 'Email',
  name: 'email',
}).getElement();

const passwordReg = new Input({
  type: 'password',
  placeholder: 'Password',
  name: 'password',
}).getElement();

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

const shipPCode = new Input({
  placeholder: 'PostalCode',
  name: 'postalCode',
}).getElement();

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
billAddress.setAttribute('id', 'bill-address');
const billStreet = new Input({
  placeholder: 'Street',
  name: 'street',
}).getElement();
const billPCode = new Input({
  placeholder: 'PostalCode',
  name: 'postalCode',
}).getElement();

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
dob.setAttribute('max', validateAge());

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
  fields: [emailReg, passwordReg, firstName, lastName, countryDropdown.getElement(), dob, shipAddress, billAddress],
  buttons: [{ text: 'Submit' }],
  callback: async (event) => {
    event.preventDefault();
    let checkValid = false;
    [emailReg, passwordReg, firstName, lastName, shipCity, shipStreet, shipPCode].forEach((elem) => {
      checkValid = checkValidator(elem);
    });

    if (!resultsCheckbox.shipAsBillCheck) {
      [billCity, billStreet, billPCode].forEach((elem) => {
        checkValid = checkValidator(elem);
      });
    }
    if (checkValid) {
      const countryDropdownText: string = countryDropdown?.getSelectedItem()?.content;
      const resultCreate = await customer().create([
        emailReg.value,
        passwordReg.value,
        firstName.value,
        lastName.value,
      ]);
      console.log(resultCreate);
      await resultCreateCustomer(resultCreate, emailReg);

      if (resultCreate.customer) {
        await customer().addAddress(resultCreate.id, resultCreate.version, [
          emailReg.value,
          firstName.value,
          lastName.value,
          shipPCode.value,
          shipCity.value,
          shipStreet.value,
          countryDropdownText,
        ]);
        if (!resultsCheckbox.shipAsBillCheck) {
          await customer().addAddress(resultCreate.id, 2, [
            emailReg.value,
            firstName.value,
            lastName.value,
            billPCode.value,
            billPCode.value,
            billPCode.value,
            countryDropdownText,
          ]);
        }
        await resultGetCustomer(resultCreate.id);
      }
    }
  },
}).getElement();

export default registrationForm;
