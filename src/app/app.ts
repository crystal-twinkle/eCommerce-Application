import OverviewPage from '../pages/overview-page';
import Header from '../features/header/header';
import { IRouterLink } from '../shared/lib/router/router';
import { ID_SELECTOR, Page } from '../shared/lib/router/pages';
import NotFoundPage from '../pages/not-found-page';
import LoginPage from '../pages/login-page';
import ProductPage from '../pages/product-page';
import Main from '../features/main/main';
import RegisterPage from '../pages/register-page';
import ShowcasesPage from '../pages/showcases/showcases-page';
import Footer from '../features/footer/footer';

export default class App {
  private header: Header;
  private main: Main;
  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();

    document.body.append(this.header.getElement(), this.main.getElement(), this.footer.getElement());
  }

  public createRoutes(): IRouterLink[] {
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
        path: Page.SHOWCASES,
        callback: () => {
          this.main.setContent([new ShowcasesPage().getElement()]);
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
