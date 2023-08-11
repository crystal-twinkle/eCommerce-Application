import InputBuilder from './input-builder';

const inputPassword = new InputBuilder({
  type: 'password',
  placeholder: 'Password',
}).getElement();

export default inputPassword;
