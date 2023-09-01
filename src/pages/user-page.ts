import ViewBuilder from '../shared/lib/view-builder';
import UserProfile from '../widgets/user-profile/user-profile';

export default class UserPage extends ViewBuilder {
  constructor() {
    super('page user-page');
  }

  public configureView(): HTMLElement[] {
    const userProfileView = new UserProfile();

    return [userProfileView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
