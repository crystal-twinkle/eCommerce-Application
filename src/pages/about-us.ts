import ViewBuilder from '../shared/lib/view-builder';
import AboutUs from '../widgets/about-us/about-us';

export default class AboutUsPage extends ViewBuilder {
  constructor() {
    super('page user-page');
  }

  public configureView(): HTMLElement[] {
    const aboutUsView = new AboutUs();

    return [aboutUsView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
