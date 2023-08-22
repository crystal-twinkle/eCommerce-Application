import validateEmail from '../../../shared/lib/validate/validate-email';
import validatePassword from '../../../shared/lib/validate/validate-password';
import validatePostalCode from '../../../shared/lib/validate/validate-postal-code';
import notEmpty from '../../../shared/lib/validate/not-empty';
import validateAge from '../../../shared/lib/validate/validate-age';

export default function checkValidator(inputElements: HTMLInputElement[]): boolean {
  let isValid = true;
  inputElements.forEach((input) => {
    const updateInput = input;
    const inputName = input.getAttribute('name');
    const validationRules: Record<string, (value: string) => boolean> = {
      email: validateEmail,
      password: validatePassword,
      firstName: notEmpty,
      lastName: notEmpty,
      city: notEmpty,
      street: notEmpty,
      postalCode: validatePostalCode,
      dob: validateAge,
    };

    if (inputName in validationRules) {
      const validationFunction = validationRules[inputName];
      if (!validationFunction(input.value)) {
        updateInput.style.borderBottom = '2px solid red';
        isValid = false;
      } else {
        updateInput.style.borderBottom = '';
      }
    }
  });
  return isValid;
}
