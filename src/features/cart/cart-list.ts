import { Cart, LineItem } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Loader from '../../shared/ui/loader/loader';
import EmptyView from '../../shared/ui/empty-view/empty-view';
import CartListCard from './cart-list-card';
import './cart.scss';
import store from '../../app/store';

export default class CartList extends CommonBuilderWrapper {
  private loader: Loader;
  private emptyView: EmptyView;

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list',
    });
  }

  public setCart(cart: Cart): void {
    this.builder.setContent();
    if (!cart.lineItems.length) {
      this.empty();
      return;
    }
    this.builder.append(this.setCards());
  }

  public setCards(): HTMLElement[] {
    return store.cart.lineItems.map((item: LineItem) => new CartListCard(item).getElement());
  }

  public empty(): void {
    this.builder.setContent();
    this.builder.append([this.emptyView.getElement()]);
  }
}
