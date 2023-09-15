import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import ViewBuilder from '../shared/lib/view-builder';
import ElementBuilder from '../shared/lib/element-builder';
import CartList from '../features/cart/cart-list';
import store from '../app/store';
import CartApi from '../entities/cart/cart';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';

export default class CartPage extends ViewBuilder {
  private cartList: CartList;

  constructor() {
    super('page cart-page');
    this.loadProducts();
    eventBus.subscribe(EventBusActions.UPDATE_USER, (data) => (data ? this.loadProducts() : this.cartList.empty()));
    eventBus.subscribe(EventBusActions.UPDATE_CART, (data) =>
      data ? this.cartList.setCards(data as Cart) : this.cartList.empty(),
    );
  }

  public configureView(): HTMLElement[] {
    this.cartList = new CartList();
    const cartView = new ElementBuilder({
      tag: 'section',
      styleClass: 'cart-list-page',
    });
    cartView.append([this.cartList.getElement()]);

    return [cartView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }

  public loadProducts(): void {
    if (store.user) {
      if (localStorage.getItem('cartID') && localStorage.getItem('token_store')) {
        CartApi.getCustomerCart().then((data: ClientResponse<Cart>) => {
          store.setCart(data.body);
          this.cartList.setCards(data.body);
        });
      } else if (localStorage.getItem('cartID') && !localStorage.getItem('token_store')) {
        CartApi.getAnonymousCart().then((data: ClientResponse<Cart>) => {
          store.setCart(data.body);
          this.cartList.setCards(data.body);
        });
      }
    }
  }
}
