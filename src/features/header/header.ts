import ElementBuilder from '../../shared/lib/element-builder';
import { Page } from '../../shared/lib/router/pages';
import './header.scss';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import UserHeaderButton from '../user-header-button/user-header-button';
import appRouter from '../../shared/lib/router/router';

export default class Header extends CommonBuilderWrapper {
  constructor() {
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
      event: {
        type: 'click',
        callback: () => appRouter.navigate(Page.OVERVIEW),
      },
      tagSettings: {
        src: '../../assets/icons/logo.svg',
      },
    });
    const navigation = new ElementBuilder({
      tag: 'nav',
    });

    const userHeaderButton = new UserHeaderButton();
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
    container.append([logo.getElement(), navigation.getElement()]);

    this.builder.append([container.getElement()]);
  }
}
