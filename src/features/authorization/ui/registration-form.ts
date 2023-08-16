import Input from '../../../shared/ui/input/input';
import inputEmail from '../../../shared/ui/input/input-email';
import inputPassword from '../../../shared/ui/input/input-password';
import validateAge from '../../../shared/lib/validate/validate-age';
import countryDropdown from './country-dropdown';
import checkAllValidator from '../lib/check-validaror';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';

const emailReg = inputEmail.getElement();
const passwordReg = inputPassword.getElement();
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

const pCode = new Input({
  placeholder: 'PostalCode',
  name: 'postalCode',
}).getElement();

const dob = new Input({
  type: 'date',
  name: 'dob',
}).getElement();
dob.setAttribute('max', validateAge());

const registrationForm = new Form({
  title: 'Registration',
  id: 'form-registration',
  fields: [emailReg, passwordReg, firstName, lastName, countryDropdown, dob, city, street, pCode],
  buttons: [{ text: 'Submit' }],
  callback: (event) => {
    event.preventDefault();
    if (checkAllValidator([emailReg, passwordReg, firstName, lastName, city, street, pCode])) {
      console.log("It's ok");
    }
  },
}).getElement();

document.body.appendChild(registrationForm);
