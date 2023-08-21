import ElementBuilder from '../../../shared/lib/element-builder';
import './tooltip.scss';
import '../../../shared/assets/style/visible.scss';

const tooltipsCard = new ElementBuilder({
  tag: 'div',
  styleClass: 'tooltip',
}).getElement();

export default tooltipsCard;
