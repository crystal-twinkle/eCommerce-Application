import ElementBuilder from '../../../shared/lib/element-builder';
import './request-message.scss';
import '../../../shared/assets/style/visible.scss';
import blackout from '../../blackout/blackout';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../../shared/ui/button/button';

const requestMessage = new ElementBuilder({
  tag: 'div',
  styleClass: 'request-message',
}).getElement();

export const requestMessageText = new ElementBuilder({
  tag: 'div',
}).getElement();

const requestMessageCross = new Button(
  () => {
    requestMessage.style.display = 'none';
    blackout.classList.remove('blackout_show');
  },
  '',
  ButtonType.CIRCLE,
  { name: 'cross', position: ButtonIconPosition.RIGHT },
  ButtonSize.SMALL,
).getElement();
requestMessageCross.classList.add('request-message__cross');
requestMessage.append(requestMessageCross, requestMessageText);

export default requestMessage;
