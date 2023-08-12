import ElementBuilder from '../shared/lib/element-builder';

export default class NotFoundPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: 'Not Found',
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
