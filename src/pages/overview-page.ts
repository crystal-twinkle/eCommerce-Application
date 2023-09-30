import ViewBuilder from '../shared/lib/view-builder';
import ChooseView from '../features/choose-view/choose-view';
import WelcomeView from '../features/welcome-view/welcome-view';
import CollaborationView from '../features/collaboration-view/collaboration-view';

export default class OverviewPage extends ViewBuilder {
  constructor() {
    super('page main-page');
  }

  public configureView(): HTMLElement[] {
    const welcomeView = new WelcomeView();
    const chooseView = new ChooseView();
    const collaborationView = new CollaborationView();

    return [welcomeView.getElement(), chooseView.getElement(), collaborationView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
