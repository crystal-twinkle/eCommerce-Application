import { TokenStore } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import flowFactory from './api-flow/flow-factory';
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
import ProductsListPage from '../pages/products-list-page/products-list-page';
import store from './store';

export default class App {
  private header: Header;
  private main: Main;
  private footer: Footer;

  constructor() {
    this.initApi();

    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();

    document.body.append(this.header.getElement(), this.main.getElement(), this.footer.getElement());
  }

  private initApi(): void {
    const tokenStore: TokenStore = JSON.parse(localStorage.getItem('token_store'));

    if (tokenStore?.refreshToken) {
      flowFactory.createRefreshTokenFlow(tokenStore.refreshToken);
      flowFactory.refreshTokenFlow
        .me()
        .get()
        .execute()
        .then((data) => store.setCustomer(data.body));
    } else {
      store.setCustomer(null);
    }
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
        path: Page.PRODUCTS,
        callback: () => {
          this.main.setContent([new ProductsListPage().getElement()]);
        },
      },
      {
        path: `${Page.PRODUCT}/${ID_SELECTOR}`,
        callback: (id: string) => {
          this.main.setContent([new ProductPage().getElement()]);
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
