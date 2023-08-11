import ElementBuilder from '../../lib/element-builder';

export default class FormBuilder extends ElementBuilder {
  constructor(config) {
    super({
      tag: 'form',
      styleClass: 'form',
    });

    if (config.event) {
      this.setEventHandler(config.event);
    }
  }
}
