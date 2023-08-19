import Input from '../../../shared/ui/input/input';
import validateAge from '../../../shared/lib/validate/validate-age';
import countryDropdown from './country-dropdown';
import checkAllValidator from '../lib/check-validaror';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import customer from '../../../entities/api/customer';
import resultCreateCustomer from '../lib/result-create-customer';

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
  callback: async (event) => {
    event.preventDefault();
    const isValid = checkAllValidator([emailReg, passwordReg, firstName, lastName, city, street, pCode]);
    if (isValid) {
      const resultRequest = await customer().create(emailReg.value, passwordReg.value, firstName.value, lastName.value);
      resultCreateCustomer(resultRequest, emailReg);
    }
  },
}).getElement();

export default registrationForm;
