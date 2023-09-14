import { Cart, CartPagedQueryResponse, ClientResponse, Customer } from '@commercetools/platform-sdk';
import flowFactory from '../../app/api-flow/flow-factory';
import UserApi from '../user/userApi';

export default class CartApi {
  public static async createCart(): Promise<string> {
    let customerId: string;

    if (localStorage.getItem('token_store')) {
      const customer = await UserApi.getUser();
      customerId = customer.id;
    }

    const response = await flowFactory.clientCredentialsFlow
      .carts()
      .post({
        body: {
          customerId,
          currency: 'USD',
          country: 'US',
        },
      })
      .execute();

    const cartID: string = response.body.id;
    localStorage.setItem('cartID', cartID);
    return cartID;
  }

  public static async addItemToCart(productId: string): Promise<void> {
    const cartID: string = localStorage.getItem('cartID') || (await this.getCustomerCart()).body.id;

    let cartVersion: number;
    if (localStorage.getItem('cartID')) {
      cartVersion = (await this.getAnonymousCart()).body.version;
    } else {
      cartVersion = (await this.getCustomerCart()).body.version;
    }

    await flowFactory.clientCredentialsFlow
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
  }

  public static async removeItemFromCart(productId: string) {
    const cartData = await this.getCustomerCart();
    const lineItemId = cartData.body.lineItems.find((item) => item.productId === productId).id;
    const cartID: string = localStorage.getItem('cartID') || (await this.getCustomerCart()).body.id;

    let cartVersion: number;
    if (localStorage.getItem('cartID')) {
      cartVersion = (await this.getAnonymousCart()).body.version;
    } else {
      cartVersion = (await this.getCustomerCart()).body.version;
    }

    await flowFactory.clientCredentialsFlow
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
  }

  public static async changeQuantity(productId: string, plusOrMinus: string) {
    const cartData = (await this.getAnonymousCart()) || (await this.getCustomerCart());
    // const cartData = await this.getAnonymousCart();
    const lineItem = cartData.body.lineItems.find((item) => item.productId === productId);
    if (lineItem) {
      const lineItemId = lineItem.id;

      let currentQuantity = lineItem.quantity;
      if (plusOrMinus === 'plus') {
        currentQuantity += 1;
      } else {
        currentQuantity -= 1;
      }

      console.log(cartData);

      const cartID: string = localStorage.getItem('cartID') || (await this.getCustomerCart()).body.id;

      let cartVersion: number;
      if (localStorage.getItem('cartID')) {
        cartVersion = (await this.getAnonymousCart()).body.version;
      } else {
        cartVersion = (await this.getCustomerCart()).body.version;
      }
      await flowFactory.clientCredentialsFlow
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
    }
  }

  public static async deleteCustomerCart(): Promise<ClientResponse<Cart>> {
    const customerId = (await UserApi.getUser()).id;
    const response = await flowFactory.clientCredentialsFlow
      .carts()
      .withId({ ID: customerId })
      .delete({
        queryArgs: {
          version: 1,
        },
      })
      .execute();
    return response;
  }

  public static async getCustomerCart(): Promise<ClientResponse<Cart>> {
    const customerId = (await UserApi.getUser()).id;
    const response = await flowFactory.clientCredentialsFlow.carts().withCustomerId({ customerId }).get().execute();
    return response;
  }

  public static async getAnonymousCart(): Promise<ClientResponse<Cart>> {
    const cartID = localStorage.getItem('cartID');
    const response = await flowFactory.clientCredentialsFlow.carts().withId({ ID: cartID }).get().execute();
    return response;
  }

  public static async getAllCarts(): Promise<ClientResponse<CartPagedQueryResponse>> {
    const response = await flowFactory.clientCredentialsFlow
      .carts()
      .get({ queryArgs: { limit: 100 } })
      .execute();
    return response;
  }

  public static async setCustomerID(customerId: string): Promise<void> {
    const cartID: string = (await this.getCustomerCart()).body.id || localStorage.getItem('cartID');
    const cartVersion: number =
      (await this.getCustomerCart()).body.version || (await this.getAnonymousCart()).body.version;

    await flowFactory.clientCredentialsFlow
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
  }
}
