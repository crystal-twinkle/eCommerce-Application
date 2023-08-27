import { Customer, Product } from '@commercetools/platform-sdk';
import eventBus, { EventBusActions } from '../shared/lib/event-bus';

class Store {
  public customer: Customer;
  public products: Product;

  public setCustomer = (newData: Customer): void => {
    this.customer = newData;
    eventBus.publish(EventBusActions.UPDATE_CUSTOMER, this.customer);
  };
}

const store = new Store();

export default store;
