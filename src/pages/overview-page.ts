import ElementBuilder from '../shared/lib/element-builder';

export default class OverviewPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      content: 'Overview Page',
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
