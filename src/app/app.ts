import { Cart, ClientResponse, Customer } from '@commercetools/platform-sdk';
import OverviewPage from '../pages/overview-page';
import Header from '../features/header/header';
import { IRouterLink } from '../shared/lib/router/router';
import { ID_SELECTOR, Page } from '../shared/lib/router/pages';
import NotFoundPage from '../pages/not-found-page';
import LoginPage from '../pages/login-page';
import ProductPage from '../pages/product-page';
import UserPage from '../pages/user-page';
import Main from '../features/main/main';
import RegisterPage from '../pages/register-page';
import Footer from '../features/footer/footer';
import ProductsListPage from '../pages/products-list-page/products-list-page';
import store from './store';
import UserApi from '../entities/user/userApi';
import ElementBuilder from '../shared/lib/element-builder';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';
import AboutUsPage from '../pages/about-us';
import CartPage from '../pages/cart-page';
import CartApi from '../entities/cart/cart-api';

export default class App {
  private readonly SCROLL_END_OFFSET: number = 150;

  private header: Header;
  private main: Main;
  private footer: Footer;
  private lazyLoaderPointRiched: boolean;

  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();
    if (localStorage.getItem('token_store')) {
      UserApi.getUser()
        .then((data: Customer) => store.setUser(data))
        .then(() => {
          if (localStorage.getItem('cartID')) {
            CartApi.getCustomerCart().then((response: ClientResponse<Cart>) => {
              store.setCart(response.body);
            });
          } else {
            store.setUser(null);
          }
        });
    } else {
      localStorage.getItem('cartID')
        ? CartApi.getAnonymousCart().then((data: ClientResponse<Cart>) => store.setCart(data.body))
        : store.setCart(null);
      store.setUser(null);
    }

    const wrapper = new ElementBuilder({
      tag: 'div',
      styleClass: 'dom-wrapper',
    });
    const wrapperEl: HTMLElement = wrapper.getElement();

    wrapper.append([this.header.getElement(), this.main.getElement(), this.footer.getElement()]);
    document.body.append(wrapper.getElement());

    wrapperEl.onscroll = () => {
      const scrollPosition: number = wrapperEl.scrollHeight - Math.ceil(wrapperEl.scrollTop + wrapperEl.clientHeight);
      if (!this.lazyLoaderPointRiched && scrollPosition < this.SCROLL_END_OFFSET) {
        eventBus.publish(EventBusActions.SCROLL_END);
        this.lazyLoaderPointRiched = true;
      }
      if (scrollPosition >= this.SCROLL_END_OFFSET) {
        this.lazyLoaderPointRiched = false;
      }
    };
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
        path: `${Page.PRODUCTS}/${ID_SELECTOR}`,
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
      {
        path: Page.USER_PROFILE,
        callback: () => {
          this.main.setContent([new UserPage().getElement()]);
        },
      },
      {
        path: Page.ABOUT_US,
        callback: () => {
          this.main.setContent([new AboutUsPage().getElement()]);
        },
      },
      {
        path: Page.CART,
        callback: () => {
          this.main.setContent([new CartPage().getElement()]);
        },
      },
    ];
  }
}
