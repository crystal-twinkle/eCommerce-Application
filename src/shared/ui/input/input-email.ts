import validateEmail from '../../lib/validate/validate-email';
import InputBuilder from './input';

const inputEmailBuild = new InputBuilder(
  {
    type: 'email',
    placeholder: 'Email',
    name: 'email',
  },
  'invalid e-mail',
  validateEmail,
);

export default inputEmailBuild;
