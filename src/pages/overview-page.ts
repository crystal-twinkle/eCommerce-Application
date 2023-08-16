import WelcomeView from '../features/welcome-view/welcome-view';
import ElementBuilder from '../shared/lib/element-builder';
import ViewBuilder from '../shared/lib/view-builder';

export default class OverviewPage extends ViewBuilder {
  constructor() {
    super('main-page');
  }

  public configureView(): HTMLElement[] {
    const welcomeView = new WelcomeView();
    return [welcomeView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
