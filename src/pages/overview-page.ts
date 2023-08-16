import ChooseView from '../features/choose-view/choose-view';
import WelcomeView from '../features/welcome-view/welcome-view';
import ElementBuilder from '../shared/lib/element-builder';
import ViewBuilder from '../shared/lib/view-builder';

export default class OverviewPage extends ViewBuilder {
  constructor() {
    super('page main-page');
  }

  public configureView(): HTMLElement[] {
    const welcomeView = new WelcomeView();
    const chooseView = new ChooseView();

    return [welcomeView.getElement(), chooseView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
