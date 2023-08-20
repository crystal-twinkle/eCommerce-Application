import ViewBuilder from '../shared/lib/view-builder';
import Router from '../app/router/router';
import NotFoundView from '../features/not-found-view/not-found-view';

export default class NotFoundPage extends ViewBuilder {
  constructor(private router: Router) {
    super('page main-page');
  }

  public configureView(): HTMLElement[] {
    const notFoundView = new NotFoundView();

    return [notFoundView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
