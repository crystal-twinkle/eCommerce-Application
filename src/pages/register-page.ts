import ElementBuilder from '../shared/lib/element-builder';

export default class RegisterPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: 'Register Page',
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
