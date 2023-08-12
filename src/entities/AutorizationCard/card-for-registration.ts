import FormBuilder from '../../shared/ui/form/form-builder';
import inputEmail from '../../shared/ui/input/input-email';
import inputPassword from '../../shared/ui/input/input-password';
import countrySelect from '../CountrySelect/country-select';
import InputBuilder from '../../shared/ui/input/input-builder';
import validateAge from '../../shared/lib/validate/validate-age';

const registrationFormBuild = new FormBuilder();
const inputFirstName = new InputBuilder({
  placeholder: 'First Name',
}).getElement();
const inputLastName = new InputBuilder({
  placeholder: 'Last Name',
}).getElement();
const inputDOB = new InputBuilder({
  type: 'date',
  placeholder: 'Last Name',
}).getElement();
inputDOB.setAttribute('max', validateAge());
const registrationCard = registrationFormBuild
  .append([inputEmail, inputPassword, inputFirstName, inputLastName, inputDOB, countrySelect])
  .getElement();

document.body.appendChild(registrationCard);
