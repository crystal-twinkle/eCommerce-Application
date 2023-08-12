import OverviewPage from '../pages/overview-page';
import Header from '../features/header/header';
import Router, { IRouterLink } from './router/router';
import { ID_SELECTOR, Page } from './router/pages';
import NotFoundPage from '../pages/not-found-page';
import LoginPage from '../pages/login-page';
import ProductPage from '../pages/product-page';
import Main from '../features/main/main';
import RegisterPage from '../pages/register-page';

export default class App {
  private router: Router;
  private header: Header;
  private main: Main;

  constructor() {
    this.router = new Router(this.createRoutes());

    this.header = new Header(this.router);
    this.main = new Main();

    this.router.navigate(Page.OVERVIEW);

    document.body.append(this.header.getElement(), this.main.getElement());
  }

  private createRoutes(): IRouterLink[] {
    return [
      {
        path: Page.OVERVIEW,
        callback: () => {
          this.main.setContent([new OverviewPage().getElement()]);
        },
      },
      {
        path: `${Page.PRODUCT}/${ID_SELECTOR}`,
        callback: (id: string) => {
          this.main.setContent([new ProductPage(id).getElement()]);
        },
      },
      {
        path: Page.LOGIN,
        callback: () => {
          this.main.setContent([new LoginPage().getElement()]);
        },
      },
      {
        path: Page.REGISTRATION,
        callback: () => {
          this.main.setContent([new RegisterPage().getElement()]);
        },
      },
      {
        path: Page.NOT_FOUND,
        callback: () => {
          this.main.setContent([new NotFoundPage().getElement()]);
        },
      },
    ];
  }
}
