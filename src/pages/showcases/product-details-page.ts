import ViewBuilder from '../../shared/lib/view-builder';
import ElementBuilder from '../../shared/lib/element-builder';

export default class NotFoundPage extends ViewBuilder {
  constructor(private id: string) {
    super('page main-page');
  }

  public configureView(): HTMLElement[] {
    const productDetails = new ElementBuilder({
      tag: 'div',
      content: this.id,
    });

    return [productDetails.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
