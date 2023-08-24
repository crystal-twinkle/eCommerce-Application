import ElementBuilder from '../../../shared/lib/element-builder';
import './request-message.scss';
import '../../../shared/assets/style/visible.scss';
import blackout from '../../blackout/blackout';
import Button from '../../../shared/ui/button/button';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../../shared/ui/button/models';

const requestMessage = new ElementBuilder({
  tag: 'div',
  styleClass: 'request-message',
}).getElement();

export const requestMessageText = new ElementBuilder({
  tag: 'div',
}).getElement();

const requestMessageCross = new Button({
  callback: () => {
    requestMessage.style.display = 'none';
    blackout.classList.remove('blackout_show');
  },
  text: '',
  type: ButtonType.CIRCLE,
  icon: { name: 'cross', position: ButtonIconPosition.RIGHT },
  size: ButtonSize.SMALL,
}).getElement();
requestMessageCross.classList.add('request-message__cross');
requestMessage.append(requestMessageCross, requestMessageText);
document.body.appendChild(requestMessage);

export default requestMessage;
