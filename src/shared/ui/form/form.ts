import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import './form.scss';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../button/button';

interface FormButton {
  text: string;
  callback?: (event: Event) => void;
}

interface FormConfig {
  title: string;
  id?: string;
  fields: HTMLElement[];
  buttons: FormButton[];
  callback: (event: Event) => void;
}

export default class Form extends CommonBuilderWrapper {
  constructor(config: FormConfig) {
    super();

    this.builder = new ElementBuilder({
      tag: 'form',
      styleClass: 'form',
    });
    if (config.id) {
      this.builder.setTagSettings({ id: config.id });
    }
    const titleForm = new ElementBuilder({
      tag: 'h2',
      styleClass: 'form__title',
      content: config.title,
    }).getElement();
    const btnContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__btn-container',
    }).getElement();
    const fieldsContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__field-container',
    }).getElement();
    fieldsContainer.prepend(...config.fields);
    this.builder.prepend([titleForm, fieldsContainer, btnContainer]);
    config.buttons.forEach((button: FormButton) => {
      let createButton: HTMLElement;
      if (button.text === 'Submit') {
        createButton = new Button(
          () => {},
          button.text,
          ButtonType.DEFAULT_COLORED,
          { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
          ButtonSize.SMALL,
        ).getElement();
        createButton.setAttribute('type', 'submit');
      } else {
        createButton = new Button(() => {}, button.text, ButtonType.DEFAULT, undefined, ButtonSize.SMALL).getElement();
      }
      createButton.classList.add('form__btn');
      btnContainer.append(createButton);
    });
    this.builder.setEventHandler({ type: 'submit', callback: config.callback });
  }
}
