import ViewBuilder from '../shared/lib/view-builder';
import ProductView from '../widgets/product-view';

export default class ProductPage extends ViewBuilder {
  constructor() {
    super('page product-page');
  }

  public configureView(): HTMLElement[] {
    const productView = new ProductView();

    return [productView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
