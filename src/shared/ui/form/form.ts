import ElementBuilder from '../../lib/element-builder';
import CommonBuilderWrapper from '../../lib/common-builder-wrapper';
import ButtonSubmit from '../button/button-submit';
import './form.scss';

interface FormConfig {
  id?: string;
  btnId?: string;
  btnCallback: (event: Event) => void;
}

export default class Form extends CommonBuilderWrapper {
  constructor(config: FormConfig) {
    super();

    this.builder = new ElementBuilder({
      tag: 'form',
      styleClass: 'form',
    });
    const buttonSubmitForm = new ButtonSubmit().getElement();
    if (config.btnId) {
      buttonSubmitForm.setAttribute('id', config.btnId);
    }
    if (config.id) {
      this.builder.setTagSettings({ id: config.id });
    }
    this.builder.append([buttonSubmitForm]);
    this.builder.setEventHandler({ type: 'submit', callback: config.btnCallback });
  }

  public prepend(nodes: HTMLElement[]) {
    this.builder.prepend(nodes);
  }
}
