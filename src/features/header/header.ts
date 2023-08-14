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
    const loginButton = new Button(() => this.router.navigate(Page.LOGIN), 'Login', true);
    const registerButton = new Button(() => this.router.navigate(Page.REGISTRATION), 'Registration');
    const crossButton = new Button(() => {}, 'adsgasdgasgdsd', false, 'cross', true, ButtonSize.BIG);

    navBuilder.append([
      overviewButton.getElement(),
      loginButton.getElement(),
      registerButton.getElement(),
      crossButton.getElement(),
    ]);

    this.builder.append([navBuilder.getElement()]);
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
