import validateEmail from './validate-email';
import validatePassword from './validate-password';
import notEmpty from './not-empty';
import validatePostalCode from './validate-postal-code';
import validateAge from './validate-age';

export interface IValidationParams {
  [inputName: string]: {
    message: string;
    validateFunction: (value: string) => boolean;
  };
}

export const ValidationParams: IValidationParams = {
  email: {
    message: 'Enter a properly formatted email address (like "example@email.com")',
    validateFunction: validateEmail,
  },
  password: {
    message:
      'Must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 special character (e.g., !@#$%^&*) and 1 number, must not contain whitespaces',
    validateFunction: validatePassword,
  },
  firstName: {
    message: 'Must contain at least one character and no special characters or numbers',
    validateFunction: notEmpty,
  },
  lastName: {
    message: 'Must contain at least one character and no special characters or numbers',
    validateFunction: notEmpty,
  },
  city: {
    message: 'Must contain at least one character and no special characters or numbers',
    validateFunction: notEmpty,
  },
  street: {
    message: 'This field must contain at least one character',
    validateFunction: notEmpty,
  },
  postalCode: {
    message: '',
    validateFunction: validatePostalCode,
  },
  dob: {
    message: 'You must be over 13 years old',
    validateFunction: validateAge,
  },
};
