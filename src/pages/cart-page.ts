import { Cart } from '@commercetools/platform-sdk';
import ViewBuilder from '../shared/lib/view-builder';
import ElementBuilder from '../shared/lib/element-builder';
import CartList from '../features/cart/cart-list';
import store from '../app/store';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';
import PageTitle from '../features/page-title/page-title';

export default class CartPage extends ViewBuilder {
  private cartList: CartList;

  constructor() {
    super('page cart-page');
    eventBus.subscribe(EventBusActions.UPDATE_CART, (data) => {
      data ? this.cartList.setCart(data as Cart) : this.cartList.empty();
    });
    if (store.cart && localStorage.getItem('cartID')) {
      this.cartList.setCart(store.cart);
    } else if (!localStorage.getItem('cartID')) {
      this.cartList.empty();
    }
  }

  public configureView(): HTMLElement[] {
    const pageTitle = new PageTitle('Cart');
    pageTitle.getElement().classList.add('title_cart-page');
    pageTitle.getElement().classList.add('product-view__title');
    this.cartList = new CartList();
    const cartView = new ElementBuilder({
      tag: 'section',
      styleClass: 'cart-list-page',
    });

    cartView.append([pageTitle.getElement(), this.cartList.getElement()]);

    return [cartView.getElement()];
  }

  public buildView(): void {
    this.view.getElement().append(...this.configureView());
  }
}
