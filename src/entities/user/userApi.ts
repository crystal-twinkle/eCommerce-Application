import { Customer } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/common-types';
import { CustomerUpdateAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import flowFactory from '../../app/api-flow/flow-factory';
import store from '../../app/store';

export default class UserApi {
  public static async getUser(): Promise<Customer> {
    const response: ClientResponse<Customer> = await flowFactory.getWorkingFlow().me().get().execute();
    return response.body;
  }

  public static async changeUserInfo(actions: CustomerUpdateAction[]): Promise<ClientResponse<Customer>> {
    const result = await flowFactory
      .getWorkingFlow()
      .customers()
      .withId({ ID: store.user.id })
      .post({
        body: {
          version: store.user.version,
          actions,
        },
      })
      .execute();
    store.setUser(result.body);
    return result;
  }
}
