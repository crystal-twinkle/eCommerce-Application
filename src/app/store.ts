import { Cart, Customer } from '@commercetools/platform-sdk';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';

class Store {
  public user: Customer;
  public cart: Cart;
  public setUser = (newData: Customer): void => {
    this.user = newData;
    eventBus.publish(EventBusActions.UPDATE_USER, this.user);
  };
  public setCart = (newDada: Cart): void => {
    this.cart = newDada;
    eventBus.publish(EventBusActions.UPDATE_CART, this.cart);
  };
}

const store = new Store();

export default store;
