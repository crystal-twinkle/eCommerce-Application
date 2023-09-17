import {
  Cart,
  CartPagedQueryResponse,
  CartUpdateAction,
  ClientResponse,
  CustomerSignInResult,
  LineItem,
} from '@commercetools/platform-sdk';
import flowFactory from '../../app/api-flow/flow-factory';
import store from '../../app/store';

export default class CartApi {
  public static async createCart(): Promise<string> {
    let customerId: string;

    if (localStorage.getItem('token_store')) {
      customerId = store.user.id;
    }

    const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
      .carts()
      .post({
        body: {
          customerId,
          currency: 'USD',
          country: 'US',
        },
      })
      .execute();

    store.setCart(response.body);
    localStorage.setItem('cartID', response.body.id);
    return store.cart.id;
  }

  public static async addItemToCart(productId: string): Promise<void> {
    const cartID: string = localStorage.getItem('cartID') || (await this.createCart());
    const cartVersion: number = store.cart.version;

    const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          actions: [
            {
              action: 'addLineItem',
              productId,
            },
          ],
          version: cartVersion,
        },
      })
      .execute();
    store.setCart(response.body);
  }

  public static async removeItemFromCart(productId: string): Promise<void> {
    const cartID: string = store.cart.id;
    const cartVersion: number = store.cart.version;
    const lineItem: LineItem = store.cart.lineItems.find((item) => item.productId === productId);

    if (lineItem) {
      const lineItemId: string = lineItem.id;

      const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
        .carts()
        .withId({ ID: cartID })
        .post({
          body: {
            actions: [
              {
                action: 'removeLineItem',
                lineItemId,
              },
            ],
            version: cartVersion,
          },
        })
        .execute();
      store.setCart(response.body);
    }
  }

  public static async clearCart(): Promise<void> {
    const cartID: string = localStorage.getItem('cartID');
    const cartVersion: number = store.cart.version;

    const actions: CartUpdateAction[] = store.cart.lineItems.map((item) => ({
      action: 'removeLineItem',
      lineItemId: item.id,
    }));

    const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          actions,
          version: cartVersion,
        },
      })
      .execute();

    store.setCart(response.body);
  }

  public static async changeQuantity(productId: string, action: 'increase' | 'decrease'): Promise<void> {
    const cartID: string = store.cart.id;
    const cartVersion: number = store.cart.version;
    const lineItem: LineItem = store.cart.lineItems.find((item) => item.productId === productId);
    if (lineItem) {
      const lineItemId = lineItem.id;

      let currentQuantity = lineItem.quantity;
      if (action === 'increase') {
        currentQuantity += 1;
      } else {
        currentQuantity -= 1;
      }

      const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
        .carts()
        .withId({ ID: cartID })
        .post({
          body: {
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId,
                quantity: currentQuantity,
              },
            ],
            version: cartVersion,
          },
        })
        .execute();
      store.setCart(response.body);
    }
  }

  public static async getCustomerCart(): Promise<ClientResponse<Cart>> {
    const customerId = store.user.id;
    const result = await flowFactory.clientCredentialsFlow.carts().withCustomerId({ customerId }).get().execute();
    localStorage.setItem('cartID', result.body.id);
    return result;
  }

  public static async getAnonymousCart(): Promise<ClientResponse<Cart>> {
    const cartID = localStorage.getItem('cartID');
    return flowFactory.clientCredentialsFlow.carts().withId({ ID: cartID }).get().execute();
  }

  public static async getAllCarts(): Promise<ClientResponse<CartPagedQueryResponse>> {
    return flowFactory.clientCredentialsFlow
      .carts()
      .get({ queryArgs: { limit: 100 } })
      .execute();
  }

  public static async setCustomerID(customerId: string): Promise<void> {
    const cartID: string = store.cart.id;
    const cartVersion: number = store.cart.version;
    const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          actions: [
            {
              action: 'setCustomerId',
              customerId,
            },
          ],
          version: cartVersion,
        },
      })
      .execute();
    store.setCart(response.body);
  }

  public static async mergeCarts(): Promise<ClientResponse<CustomerSignInResult>> {
    const email: string = store.user.email;
    const password: string = store.user.password;
    return flowFactory.anonymousSessionFlow
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          activeCartSignInMode: 'MergeWithExistingCustomerCart',
        },
      })
      .execute();
  }

  public static async addDiscountCode(code: string): Promise<Cart> {
    const response: ClientResponse<Cart> = await flowFactory.clientCredentialsFlow
      .carts()
      .withId({ ID: store.cart.id })
      .post({
        body: {
          actions: [
            {
              action: 'addDiscountCode',
              code,
            },
          ],
          version: store.cart.version,
        },
      })
      .execute();
    return response.body;
  }
}
