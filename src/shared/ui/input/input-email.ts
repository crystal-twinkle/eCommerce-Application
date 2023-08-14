import InputBuilder from './input-builder';
import './input.scss';

const inputEmailBuild = new InputBuilder({
  type: 'email',
  placeholder: 'Email',
  name: 'email',
});

export default inputEmailBuild;
