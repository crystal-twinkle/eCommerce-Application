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
  private cartCards: HTMLElement[];
  private loader: Loader;
  private emptyView: EmptyView;
  private costContainer: ElementBuilder;
  private cost: ElementBuilder;
  private clearButton: Button;
  private whitelist: ElementBuilder;

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list',
    });
    this.whitelist = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__whitelist',
    });
  }

  public setCart(cart: Cart): void {
    this.builder.setContent();
    if (!cart.lineItems.length) {
      this.empty();
      return;
    }
    this.cartCards = cart.lineItems.map((item: LineItem) => new CartListCard(item).getElement());

    this.costContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__cost-container cart-list-card__cost-container_total',
      content: `Total:`,
    });

    this.cost = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list-card__cost',
      content: `$${(store.cart.totalPrice.centAmount / 100).toFixed(2)}`,
    });
    this.costContainer.append([this.cost.getElement()]);

    this.clearButton = new Button({
      callback: async () => {
        CartApi.clearCart();
      },
      type: ButtonType.DEFAULT,
      text: 'Clear Cart',
    });
    this.clearButton.getElement().classList.add('cart-list-card__button_clear');
    this.builder.append(this.cartCards);
    this.whitelist.append([this.setPromo(), this.costContainer.getElement(), this.clearButton.getElement()]);
    this.builder.getElement().after(this.whitelist.getElement());
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
