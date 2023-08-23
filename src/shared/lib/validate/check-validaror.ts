import validateEmail from './validate-email';
import validatePassword from './validate-password';
import validatePostalCode from './validate-postal-code';
import notEmpty from './not-empty';
import validateAge from './validate-age';
import validateStreet from './validate-street';

export default function checkValidator(inputElement: HTMLInputElement): boolean {
  let isValid = true;
  const inputName = inputElement.getAttribute('name');
  const validationRules: Record<string, (value: string) => boolean> = {
    email: validateEmail,
    password: validatePassword,
    firstName: notEmpty,
    lastName: notEmpty,
    city: notEmpty,
    street: validateStreet,
    postalCode: validatePostalCode,
    dob: validateAge,
  };

  if (inputName in validationRules) {
    const validationFunction = validationRules[inputName];
    if (!validationFunction(inputElement.value)) {
      inputElement.classList.add('input_invalid');
      isValid = false;
    } else {
      inputElement.classList.remove('input_invalid');
    }
  }
  return isValid;
}
