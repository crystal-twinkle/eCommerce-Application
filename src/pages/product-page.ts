import ElementBuilder from '../shared/lib/element-builder';

export default class ProductPage {
  private builder: ElementBuilder;

  constructor(private id: string) {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: id,
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
