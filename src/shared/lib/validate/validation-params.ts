export interface IValidationParams {
  [inputName: string]: {
    message: string;
  };
}

export const ValidationParams: IValidationParams = {
  email: {
    message: 'Enter a properly formatted email address (like "example@email.com"), must not contain whitespaces',
  },
  password: {
    message:
      'Must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 special character (e.g., !@#$%^&*) and 1 number, must not contain whitespaces',
  },
  firstName: {
    message: 'Must contain at least one character and no special characters or numbers',
  },
  lastName: {
    message: 'Must contain at least one character and no special characters or numbers',
  },
  city: {
    message: 'Must contain at least one character and no special characters or numbers',
  },
  street: {
    message: 'This field must contain at least one character',
  },
  postalCode: {
    message: '',
  },
  dob: {
    message: 'You must be over 13 years old',
  },
};
