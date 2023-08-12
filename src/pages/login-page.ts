import ElementBuilder from '../shared/lib/element-builder';

export default class LoginPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: 'Login Page',
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
