import InputBuilder from './input-builder';
import './input.scss';

const inputPasswordBuild = new InputBuilder({
  type: 'password',
  placeholder: 'Password',
  name: 'password',
});

export default inputPasswordBuild;
