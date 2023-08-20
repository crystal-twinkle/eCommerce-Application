import ElementBuilder from '../../shared/lib/element-builder';
import Router from '../../app/router/router';
import { Page } from '../../app/router/pages';
import './header.scss';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import UserHeaderButton from '../user-header-button/user-header-button';

export default class Header extends CommonBuilderWrapper {
  constructor(private router: Router) {
    super();

    this.builder = new ElementBuilder({
      tag: 'header',
      styleClass: 'header',
    });
    const container = new ElementBuilder({
      tag: 'div',
      styleClass: 'container header-container',
    });
    const logo = new ElementBuilder({
      tag: 'img',
      styleClass: 'header__logo',
      tagSettings: {
        src: '../../assets/icons/logo.svg',
      },
    });
    const stubButtons = new ElementBuilder({
      tag: 'div',
    });
    const navigation = new ElementBuilder({
      tag: 'nav',
    });

    const notFoundPageButton = new Button(() => this.router.navigate(Page.NOT_FOUND), 'Not Found');
    const overviewButton = new Button(() => this.router.navigate(Page.OVERVIEW), 'Overview');
    const registerButton = new Button(() => this.router.navigate(Page.REGISTRATION), 'Registration');
    const showCases = new Button(() => this.router.navigate(Page.SHOWCASES), 'Show cases');
    stubButtons.append([
      notFoundPageButton.getElement(),
      overviewButton.getElement(),
      registerButton.getElement(),
      showCases.getElement(),
    ]);

    const userHeaderButton = new UserHeaderButton(this.router);

    const favoritesButton = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'heart', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
    );
    const cartButton = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'shopping-bag', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
    );
    cartButton.setBadge(4);

    navigation.append([userHeaderButton.getElement(), favoritesButton.getElement(), cartButton.getElement()]);
    container.append([logo.getElement(), stubButtons.getElement(), navigation.getElement()]);

    this.builder.append([container.getElement()]);
  }

  private openUserCard(): void {}
}
