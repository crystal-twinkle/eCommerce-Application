import { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { Cart, Customer } from '@commercetools/platform-sdk';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';
import { Mutable } from '../shared/const/mutable';

class Store {
  public user: Customer;
  public products: Mutable<ProductProjectionPagedQueryResponse>;
  public cart: Cart;

  public setUser = (newData: Customer): void => {
    this.user = newData;
    eventBus.publish(EventBusActions.UPDATE_USER, this.user);
  };

  public setCart = (newDada: Cart): void => {
    this.cart = newDada;
    eventBus.publish(EventBusActions.UPDATE_CART, this.cart);
  };

  public setProducts(newData: ProductProjectionPagedQueryResponse, add?: boolean): void {
    if (!this.products || !add) {
      this.products = newData;
    } else {
      this.products.results = [...this.products.results, ...newData.results];
    }
  }
}

const store = new Store();

export default store;
