import InputBuilder from '../../../shared/ui/input/input-builder';
import inputEmail from '../../../shared/ui/input/input-email';
import inputPassword from '../../../shared/ui/input/input-password';
import validateAge from '../../../shared/lib/validate/validate-age';
import countrySelect from './country-dropdown';
import SpanError from '../../../shared/ui/span/span-error';
import checkAllValidator from '../lib/check-validaror';
import Form from '../../../shared/ui/form/form';

const emailReg = inputEmail.getElement();
const errorEmailReg = new SpanError({ 'data-id': 'error-email', content: 'Invalid email address' }).getElement();
const passwordReg = inputPassword.getElement();
const errorPasswordReg = new SpanError({
  'data-id': 'error-password',
  content: 'Invalid password format',
}).getElement();

const firstName = new InputBuilder({
  placeholder: 'First Name',
  name: 'firstName',
}).getElement();
const errorFirstName = new SpanError({
  'data-id': 'error-firstName',
  content: 'Enter a valid first name',
}).getElement();

const lastName = new InputBuilder({
  placeholder: 'Last Name',
  name: 'lastName',
}).getElement();
const errorLastName = new SpanError({
  'data-id': 'error-lastName',
  content: 'Enter a valid last name',
}).getElement();

const city = new InputBuilder({
  placeholder: 'City',
  name: 'city',
}).getElement();
const errorCity = new SpanError({ 'data-id': 'error-city', content: 'Please enter a city' }).getElement();

const street = new InputBuilder({
  placeholder: 'Street',
  name: 'street',
}).getElement();
const errorStreet = new SpanError({
  'data-id': 'error-street',
  content: 'Please enter a street address',
}).getElement();

const pCode = new InputBuilder({
  placeholder: 'PostalCode',
  name: 'postalCode',
}).getElement();
const errorPCode = new SpanError({
  'data-id': 'error-postalCode',
  content: 'Please enter a valid postal code',
}).getElement();

const dob = new InputBuilder({
  type: 'date',
  name: 'dob',
}).getElement();
dob.setAttribute('max', validateAge());

const registrationForm = new Form({
  id: 'form-registration',
  btnId: 'btn-registration',
  btnCallback: (event) => {
    event.preventDefault();
    if (checkAllValidator([emailReg, passwordReg, firstName, lastName, city, street, pCode])) {
      console.log("It's ok");
    }
  },
}).getElement();

registrationForm.prepend(
  emailReg,
  errorEmailReg,
  passwordReg,
  errorPasswordReg,
  firstName,
  errorFirstName,
  lastName,
  errorLastName,
  countrySelect,
  city,
  errorCity,
  street,
  errorStreet,
  pCode,
  errorPCode,
);
document.body.appendChild(registrationForm);
