import validateEmail from '../../../shared/lib/validate/validate-email';
import validatePassword from '../../../shared/lib/validate/validate-password';
import validatePostalCode from '../../../shared/lib/validate/validate-postal-code';
import notEmpty from '../../../shared/lib/validate/not-empty';

export default function checkValidator(inputElement: HTMLInputElement) {
  let isValid = true;
  const updateInput = inputElement;
  const inputName = inputElement.getAttribute('name');
  const validationRules: Record<string, (value: string) => boolean> = {
    email: validateEmail,
    password: validatePassword,
    firstName: notEmpty,
    lastName: notEmpty,
    city: notEmpty,
    street: notEmpty,
    postalCode: validatePostalCode,
  };

  if (inputName in validationRules) {
    const validationFunction = validationRules[inputName];
    if (!validationFunction(inputElement.value)) {
      updateInput.style.borderBottom = '2px solid red';
      isValid = false;
    } else {
      updateInput.style.borderBottom = '';
    }
  }

  return isValid;
}
