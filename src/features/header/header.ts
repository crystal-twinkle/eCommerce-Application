import ElementBuilder from '../../shared/lib/element-builder';
import Router from '../../app/router/router';
import { Page } from '../../app/router/pages';
import './header.css';
import Button, { ButtonSize } from '../../shared/ui/button/button';

export default class Header {
  private builder: ElementBuilder;

  constructor(private router: Router) {
    this.builder = new ElementBuilder({
      tag: 'header',
    });

    const navBuilder = new ElementBuilder({
      tag: 'nav',
      styleClass: 'container',
    });

    const overviewButton = new Button(() => this.router.navigate(Page.OVERVIEW), 'Overview');
    const loginButton = new Button(() => this.router.navigate(Page.LOGIN), 'Login');
    const registerButton = new Button(() => this.router.navigate(Page.REGISTRATION), 'Registration');
    const showCases = new Button(() => this.router.navigate(Page.SHOWCASES), 'Show cases');

    navBuilder.append([
      overviewButton.getElement(),
      loginButton.getElement(),
      registerButton.getElement(),
      showCases.getElement(),
    ]);

    this.builder.append([navBuilder.getElement()]);
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
