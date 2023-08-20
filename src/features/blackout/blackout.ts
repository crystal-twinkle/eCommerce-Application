import ElementBuilder from '../../shared/lib/element-builder';
import './blackout.scss';

const blackout = new ElementBuilder({
  tag: 'div',
  styleClass: 'blackout',
}).getElement();

document.body.appendChild(blackout);

export default blackout;
