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

  constructor() {
    super();
    this.loader = new Loader();
    this.emptyView = new EmptyView('No Products');

    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-page',
    });
  }

  public setCart(cart: Cart): void {
    this.builder.setContent();
    if (!cart.lineItems.length) {
      this.empty();
      return;
    }
    const cartCards: HTMLElement[] = cart.lineItems.map((item: LineItem) => new CartListCard(item).getElement());
    const cartList = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list',
    });

    cartList.append(cartCards);
    const clearButton = new Button({
      callback: async () => {
        await CartApi.clearCart();
        this.empty();
      },
      type: ButtonType.DEFAULT,
      text: 'Clear Cart',
    });
    clearButton.getElement().classList.add('cart-list__button', '_clear');
    this.builder.append([cartList.getElement(), this.setPriceList(), clearButton.getElement()]);
  }

  public setPriceList(): HTMLElement {
    const costContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container _cost',
      content: `Total:`,
    });

    const priceContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container _cost _price',
    });

    const totalPriceValue = Number((store.cart.totalPrice.centAmount / 100).toFixed(2));
    const totalPrice = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container__price',
      content: `${totalPriceValue}`,
    });
    priceContainer.append([totalPrice.getElement()]);
    if (store.cart.discountCodes.length) {
      let sum = 0;
      store.cart.lineItems.forEach((e) => {
        if (e.price?.discounted) {
          sum += Number(e.price.discounted.value.centAmount);
        } else {
          sum += Number(e.price.value.centAmount);
        }
      });
      const preDiscountedPrice = new ElementBuilder({
        tag: 'div',
        styleClass: 'product-view__price_discounted',
        content: `${sum / 100}`,
      });

      preDiscountedPrice.setStyleClass('product-view__price_cross-out');
      totalPrice.setStyleClass('product-view__price_discounted');
      priceContainer.prepend([preDiscountedPrice.getElement()]);
    }
    costContainer.append([priceContainer.getElement()]);
    const priceList = new ElementBuilder({
      tag: 'div',
      styleClass: 'cart-list__cost-container _list',
    });
    priceList.append([this.setPromo(), costContainer.getElement()]);
    return priceList.getElement();
  }

  public setPromo(): HTMLElement {
    const promocode = new Input({
      styleClass: 'cart-list__promocode',
      placeholder: 'Promo code',
      event: {
        type: 'keypress',
        callback: (event) => {
          if (event instanceof KeyboardEvent) {
            if (event.code === 'Enter') {
              CartApi.addDiscountCode(promocode.getElement().value)
                .then((data) => {
                  if (!data.discountCodes.length) {
                    store.setCart(data);
                  } else {
                    promocode.setErrorMessage('Promo code has been applied');
                  }
                })
                .catch(() => promocode.setErrorMessage('Invalid promo code'));
            }
          }
        },
      },
    });
    return promocode.getElement();
  }

  public empty(): void {
    this.builder.setContent();
    this.builder.append([this.emptyView.getElement()]);
  }
}
