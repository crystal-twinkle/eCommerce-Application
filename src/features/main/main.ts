import './main.css';
import ElementBuilder from '../../shared/lib/element-builder';

export default class Main {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'main',
    });
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }

  public setContent(nodes: HTMLElement[]): void {
    this.builder.setContent();
    this.builder.append(nodes);
  }
}
