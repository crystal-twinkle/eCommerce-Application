import ElementBuilder from '../../../shared/lib/element-builder';
import validationTooltips from '../lib/validation-tooltips';
import './tooltip.scss';

const tooltipsCard = new ElementBuilder({
  tag: 'div',
  styleClass: 'tooltip',
}).getElement();
window.addEventListener('load', () => {
  validationTooltips();
});
document.body.appendChild(tooltipsCard);
