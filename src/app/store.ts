import { Customer, Product } from '@commercetools/platform-sdk';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';

class Store {
  public user: Customer;
  public products: Product[];

  public setUser = (newData: Customer): void => {
    this.user = newData;
    eventBus.publish(EventBusActions.UPDATE_USER, this.user);
  };

  public setCategory = (value: string): void => {
    eventBus.publish(EventBusActions.SORT_CATALOG, value);
  };
}

const store = new Store();

export default store;
