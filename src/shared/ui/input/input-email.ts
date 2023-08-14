import InputBuilder from './input';
import './input.scss';

const inputEmailBuild = new InputBuilder({
  type: 'email',
  placeholder: 'Email',
  name: 'email',
});

export default inputEmailBuild;
