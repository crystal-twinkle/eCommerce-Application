import { Cart, LineItem } from '@commercetools/platform-sdk';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';
import Loader from '../../shared/ui/loader/loader';
import EmptyView from '../../shared/ui/empty-view/empty-view';
import CartListCard from './cart-list-card';
import './cart.scss';
import store from '../../app/store';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import CartApi from '../../entities/cart/cart-api';
import { ButtonType } from '../../shared/ui/button/models';

export default class CartList extends CommonBuilderWrapper {
  private loader: Loader;
  private emptyView: EmptyView;
  private priceList: ElementBuilder;

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list',
    });
    this.priceList = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container',
    });
  }

  public setCart(cart: Cart): void {
    this.builder.setContent();
    if (!cart.lineItems.length) {
      this.empty();
      return;
    }
    const cartCards: HTMLElement[] = cart.lineItems.map((item: LineItem) => new CartListCard(item).getElement());
    this.builder.append(cartCards);
    const clearButton = new Button({
      callback: async () => {
        await CartApi.clearCart();
      },
      type: ButtonType.DEFAULT,
      text: 'Clear Cart',
    });
    clearButton.getElement().classList.add('cart-list-card__button_clear');
    this.builder.getElement().after(this.setPriceList(), clearButton.getElement());
  }

  public setPriceList(): HTMLElement {
    const costContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container _list',
      content: `Total:`,
    });

    const totalPrice = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container__price',
      content: `$${(store.cart.totalPrice.centAmount / 100).toFixed(2)}`,
    });
    costContainer.append([totalPrice.getElement()]);
    this.priceList.append([this.setPromo(), costContainer.getElement()]);
    return this.priceList.getElement();
  }

  public setPromo(): HTMLElement {
    const promocode = new Input({ styleClass: 'cart-list__promocode', placeholder: 'Promo code' });
    return promocode.getElement();
  }

  public empty(): void {
    this.builder.setContent();
    this.builder.append([this.emptyView.getElement()]);
  }
}
