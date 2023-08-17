import ElementBuilder from './element-builder';

export default abstract class ViewBuilder {
  view: ElementBuilder;
  wrapper: ElementBuilder;

  constructor(viewClassName: string = '', tag: string = 'section') {
    this.view = new ElementBuilder({
      tag,
      styleClass: viewClassName,
    });

    this.wrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'wrapper',
    });

    this.buildView();
  }

  public abstract configureView(): HTMLElement[];

  public buildView() {
    this.wrapper.getElement().append(...this.configureView());
    this.view.getElement().append(this.wrapper.getElement());
  }

  public getElement() {
    return this.view.getElement();
  }
}
