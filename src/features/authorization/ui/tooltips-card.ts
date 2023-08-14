import ElementBuilder from '../../../shared/lib/element-builder';
import './tooltips.scss';

const tooltipsCard = new ElementBuilder({
  tag: 'div',
  styleClass: 'tooltips',
}).getElement();

document.body.appendChild(tooltipsCard);
