import ElementBuilder from '../../shared/lib/element-builder';
import Router from '../../app/router/router';
import { Page } from '../../app/router/pages';
import './header.css';

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

    const overviewButton = new ElementBuilder({
      tag: 'button',
      content: 'Overview',
      event: {
        type: 'click',
        callback: () => {
          this.router.navigate(Page.OVERVIEW);
        },
      },
    });
    const loginButton = new ElementBuilder({
      tag: 'button',
      content: 'Login',
      event: {
        type: 'click',
        callback: () => {
          this.router.navigate(Page.LOGIN);
        },
      },
    });
    const registerButton = new ElementBuilder({
      tag: 'button',
      content: 'Registration',
      event: {
        type: 'click',
        callback: () => {
          this.router.navigate(Page.REGISTRATION);
        },
      },
    });

    navBuilder.append([overviewButton.getElement(), loginButton.getElement(), registerButton.getElement()]);

    this.builder.append([navBuilder.getElement()]);
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
