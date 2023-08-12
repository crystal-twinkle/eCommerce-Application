import ElementBuilder from '../../lib/element-builder';

export default class FormBuilder extends ElementBuilder {
  constructor() {
    super({
      tag: 'form',
      styleClass: 'form',
    });
  }
}
