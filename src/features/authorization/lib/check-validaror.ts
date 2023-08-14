import validateEmail from '../../../shared/lib/validate/validate-email';
import validatePassword from '../../../shared/lib/validate/validate-password';
import validateName from '../../../shared/lib/validate/validate-name';
import validateAddress from '../../../shared/lib/validate/validate-address';
import validationTooltips from './validation-tooltips';
import validationError from './validation-error';

export default function checkValidator(inputElements: HTMLInputElement[]) {
  console.log('1');
  let isValid = true;
  const [email, password, firstName, lastName, city, street, pCode] = inputElements;
  const fieldsToValidate = [
    { element: email, value: email.value, validator: validateEmail },
    { element: password, value: password.value, validator: validatePassword },
    { element: firstName, value: firstName.value, validator: validateName },
    { element: lastName, value: lastName.value, validator: validateName },
    { element: city, value: city.value, validator: validateAddress.city },
    { element: street, value: street.value, validator: validateAddress.street },
    { element: pCode, value: pCode.value, validator: validateAddress.postalCode },
  ];

  fieldsToValidate.forEach((field) => {
    if (!field.validator(field.value)) {
      if (!field.element) {
        return;
      }
      validationTooltips(field.element).add();
      validationError(field.element).show();
      isValid = false;
    } else {
      validationError(field.element).hid();
      validationTooltips(field.element).remove();
    }
  });

  return isValid;
}
