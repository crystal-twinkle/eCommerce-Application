import InputBuilder from './input-builder';

const inputEmail = new InputBuilder({
  type: 'email',
  placeholder: 'Email',
}).getElement();

export default inputEmail;
