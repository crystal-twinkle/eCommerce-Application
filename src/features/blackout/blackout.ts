import ElementBuilder from '../../shared/lib/element-builder';
import './blackout.scss';

const blackout = new ElementBuilder({
  tag: 'div',
  styleClass: 'blackout',
}).getElement();
// blackout.classList.add('blackout_show');
document.body.appendChild(blackout);

export default blackout;
