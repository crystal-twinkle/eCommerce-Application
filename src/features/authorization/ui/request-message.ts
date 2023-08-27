import ElementBuilder from '../../../shared/lib/element-builder';
import './request-message.scss';
import '../../../shared/assets/style/visible.scss';
import blackout from '../../blackout/blackout';
import Button from '../../../shared/ui/button/button';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../../shared/ui/button/models';
import CommonBuilderWrapper from '../../../shared/lib/common-builder-wrapper';

export default class RequestMessage extends CommonBuilderWrapper {
  private readonly requestMessage: HTMLElement;
  private readonly requestMessageText: HTMLElement;
  constructor() {
    super();

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'request-message',
    });
    this.requestMessage = this.builder.getElement();
    this.requestMessageText = new ElementBuilder({
      tag: 'div',
    }).getElement();

    const requestMessageCross = new Button({
      callback: () => {
        this.requestMessage.classList.remove('visible');
        blackout.classList.remove('blackout_show');
        document.body.removeChild(this.requestMessage);
      },
      type: ButtonType.CIRCLE,
      icon: { name: 'cross', position: ButtonIconPosition.RIGHT },
      size: ButtonSize.SMALL,
    }).getElement();
    requestMessageCross.classList.add('request-message__cross');

    this.requestMessage.append(requestMessageCross, this.requestMessageText);
  }

  protected basicAction() {
    this.requestMessage.classList.add('visible');
    blackout.classList.add('blackout_show');
    document.body.appendChild(this.requestMessage);
  }

  public createSuccess() {
    this.requestMessageText.textContent = 'Account created successfully! 🎉';
    this.basicAction();
  }

  public logSuccess() {
    this.requestMessageText.textContent = 'You are logged in!';
    this.basicAction();
  }

  public badResult() {
    this.requestMessageText.textContent = 'Something went wrong, try again later :)';
    this.basicAction();
  }
}
