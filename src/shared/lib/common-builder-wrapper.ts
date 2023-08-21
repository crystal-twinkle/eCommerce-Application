import ElementBuilder from './element-builder';

export default class CommonBuilderWrapper {
  protected builder: ElementBuilder;

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
