import validateEmail from '../../../shared/lib/validate/validate-email';
import validatePassword from '../../../shared/lib/validate/validate-password';
import validatePostalCode from '../../../shared/lib/validate/validate-postal-code';
import notEmpty from '../../../shared/lib/validate/not-empty';

import validationTooltip, { tooltipRegistry } from './validation-tooltips';

export default function checkValidator(inputElements: HTMLInputElement[]) {
  let isValid = true;
  const [email, password, firstName, lastName, city, street, pCode] = inputElements;
  const fieldsToValidate = [
    { element: email, value: email.value, validator: validateEmail },
    { element: password, value: password.value, validator: validatePassword },
    { element: firstName, value: firstName.value, validator: notEmpty },
    { element: lastName, value: lastName.value, validator: notEmpty },
    { element: city, value: city.value, validator: notEmpty },
    { element: street, value: street.value, validator: notEmpty },
    { element: pCode, value: pCode.value, validator: validatePostalCode },
  ];

  fieldsToValidate.forEach((field) => {
    const newField = { ...field };
    if (!field.validator(field.value)) {
      if (!field.element) {
        return;
      }
      const inputName = field.element.getAttribute('name');
      if (!Object.prototype.hasOwnProperty.call(tooltipRegistry, inputName)) {
        validationTooltip(field.element).add();
      }
      newField.element.style.borderBottom = '2px solid red';
      isValid = false;
    } else {
      validationTooltip(field.element).remove();
      newField.element.style.borderBottom = '';
    }
  });

  return isValid;
}
